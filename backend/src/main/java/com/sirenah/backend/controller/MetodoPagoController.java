package com.sirenah.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import com.mercadopago.resources.preference.PreferenceBackUrls;
import com.sirenah.backend.dto.CarritoDTO;
import com.sirenah.backend.dto.CarritoDetalleDTO;
import com.sirenah.backend.model.MetodoPago;
import com.sirenah.backend.model.Producto;
import com.sirenah.backend.service.MetodoPagoService;
import com.sirenah.backend.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.*;


@RestController
@RequestMapping("/todosroles/MercadoPago")
public class MetodoPagoController {

    @Value("${mercadopago.token}")
    private String mercadoPagoAccessToken;

    @Value("${vite.api}")
    private String viteapi;

    @Autowired
    private ProductoService productoService;

    @Autowired
    private MetodoPagoService metodoPagoService;

    @PostMapping("/ProcederPagar")
    public ResponseEntity<Map<String, String>> mercado(@RequestBody CarritoDTO carrito) throws MPException, MPApiException, JsonProcessingException {
        MercadoPagoConfig.setAccessToken(mercadoPagoAccessToken);

        List<PreferenceItemRequest> items = new ArrayList<>();

        for (CarritoDetalleDTO detalle : carrito.getDetalles()) {
            Producto producto = productoService.buscarPorId(detalle.getIdProducto())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado: " + detalle.getIdProducto()));

            PreferenceItemRequest itemRequest = PreferenceItemRequest.builder()
                    .id(String.valueOf(detalle.getIdProducto()))
                    .title(producto.getNombre())
                    .description("Producto en carrito")
                    .quantity(detalle.getCantidad())
                    .currencyId("PEN")
                    .unitPrice(BigDecimal.valueOf(detalle.getPrecioUnitario()))
                    .build();

            items.add(itemRequest);
        }

        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                .success(viteapi + "/PagoExitoso")
                .failure(viteapi + "/PagoFallido")
                .pending(viteapi + "/PagoPendiente")
                .build();

        ObjectMapper mapper = new ObjectMapper();
        String carritoJson = mapper.writeValueAsString(carrito);
        String externalReference = Base64.getEncoder().encodeToString(carritoJson.getBytes(StandardCharsets.UTF_8));

        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(items)
                .backUrls(backUrls)
                .autoReturn("approved")
                .notificationUrl("https://42c801d875b0.ngrok-free.app/public/webhook")
                .externalReference(externalReference)
                .build();



        PreferenceClient client = new PreferenceClient();
        Preference preference = client.create(preferenceRequest);

        Map<String, String> response = new HashMap<>();
        response.put("preferenceId", preference.getId());

        return ResponseEntity.ok(response);
    }
    // Buscar un método de pago por ID
    @GetMapping("/ObtenerPorTransaccion/{idTransaccion}")
    public ResponseEntity<?> obtenerPorIdTransaccion(@PathVariable String idTransaccion) {
        return metodoPagoService.buscarPorIdTransaccion(idTransaccion)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/ObtenerPorId/{idPago}")
    public ResponseEntity<?> obtenerPorIdPago(@PathVariable Integer idPago) {
        // Solo funciona si agregas el método buscarPorId() como opcional en la implementación
        if (metodoPagoService instanceof com.sirenah.backend.service.impl.MetodoPagoServiceImpl impl) {
            return impl.buscarPorId(idPago)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } else {
            return ResponseEntity.internalServerError().body("Método no implementado.");
        }
    }

}
