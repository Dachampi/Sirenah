package com.sirenah.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import com.sirenah.backend.dto.CarritoDTO;
import com.sirenah.backend.dto.CarritoDetalleDTO;
import com.sirenah.backend.model.Carrito;
import com.sirenah.backend.model.DetallePedido;
import com.sirenah.backend.model.MetodoPago;
import com.sirenah.backend.model.Pedido;
import com.sirenah.backend.service.CarritoDetalleService;
import com.sirenah.backend.service.CarritoService;
import com.sirenah.backend.service.MetodoPagoService;
import com.sirenah.backend.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/public")

public class WebhookController {

    @Value("${mercadopago.token}")
    private String mercadoPagoAccessToken;

    @Autowired
    private MetodoPagoService metodoPagoService;

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private CarritoDetalleService carritoDetalleService;
    @Autowired
    private CarritoService carritoService;

    @PostMapping("/webhook")
    public ResponseEntity<String> recibirNotificacion(@RequestBody Map<String, Object> body)
            throws MPException, MPApiException, JsonProcessingException {

        System.out.println("===== Webhook recibido =====");
        System.out.println(body);

        String type = (String) body.get("type");

        if (!"payment".equals(type)) {
            return ResponseEntity.ok("No es tipo payment");
        }

        Map<String, Object> data = (Map<String, Object>) body.get("data");
        if (data == null || data.get("id") == null) {
            return ResponseEntity.ok("Data incompleta");
        }

        Long paymentId = Long.parseLong(data.get("id").toString());

        MercadoPagoConfig.setAccessToken(mercadoPagoAccessToken);
        PaymentClient client = new PaymentClient();
        Payment payment = client.get(paymentId);

        String status = payment.getStatus();
        if (!"approved".equalsIgnoreCase(status)) {
            System.out.println("⚠️ El pago no fue aprobado. Estado: " + status);
            return ResponseEntity.ok("Pago no aprobado. No se creó el pedido ni el metodo de pago.");
        }

        // Decodificar el carrito desde externalReference
        byte[] decodedBytes = java.util.Base64.getDecoder().decode(payment.getExternalReference());
        String carritoJson = new String(decodedBytes, java.nio.charset.StandardCharsets.UTF_8);

        ObjectMapper objectMapper = new ObjectMapper();
        CarritoDTO carritoDTO = objectMapper.readValue(carritoJson, CarritoDTO.class);

        // Construir Pedido
        Pedido pedido = new Pedido();
        pedido.setIdCliente(carritoDTO.getIdUsuario());
        pedido.setDireccion("Ica");
        pedido.setFechaPedido(OffsetDateTime.now());
        pedido.setEstado("pendiende");

        List<DetallePedido> detalles = new ArrayList<>();
        for (CarritoDetalleDTO detalleDTO : carritoDTO.getDetalles()) {
            DetallePedido detalle = new DetallePedido();
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.setPrecioUnitario(BigDecimal.valueOf(detalleDTO.getPrecioUnitario()));
            detalle.setSubtotal(BigDecimal.valueOf(detalleDTO.getSubtotal()));
            detalle.setIdProducto(detalleDTO.getIdProducto());
            detalle.setNombreProducto("Producto"); // opcional, o lo agregas en el DTO
            detalle.setPedido(pedido);
            detalles.add(detalle);
        }

        pedido.setDetalles(detalles);

        Pedido pedidoCreado = pedidoService.crearPedido(pedido);

        MetodoPago metodoPago = new MetodoPago();
        metodoPago.setTipo(payment.getPaymentTypeId());
        metodoPago.setIdTransaccion(payment.getId().toString());
        metodoPago.setMoneda(payment.getCurrencyId());
        metodoPago.setFechaPago(OffsetDateTime.now());
        metodoPago.setTotal(payment.getTransactionAmount());
        metodoPago.setEstado(status);
        metodoPago.setPedido(pedidoCreado);

        metodoPagoService.guardar(metodoPago);

        Integer idUsuario = pedido.getIdCliente();

        Carrito carrito = carritoService.getCarrito(idUsuario);

        carritoDetalleService.vaciarCarrito(carrito.getIdCarrito());



        return ResponseEntity.ok("✅ Pedido y MetodoPago guardados correctamente.");
    }


}
