package com.sirenah.backend.service.impl;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.common.AddressRequest;
import com.mercadopago.client.common.IdentificationRequest;
import com.mercadopago.client.common.PhoneRequest;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.payment.Payment;
import com.sirenah.backend.dto.CardPaymentDTO;
import com.sirenah.backend.dto.PaymentResponseDTO;
import com.sirenah.backend.exception.MercadoPagoException;
import com.sirenah.backend.model.Carrito;
import com.sirenah.backend.model.CarritoDetalle;
import com.sirenah.backend.model.OurUsers;
import com.sirenah.backend.model.Producto;
import com.sirenah.backend.service.CarritoService;
import com.sirenah.backend.service.OurUserService;
import com.sirenah.backend.service.ProductoService;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class CardPaymentService {

    @Autowired
    private ProductoService productoService;
    @Autowired
    private CarritoService carritoService;
    @Autowired
    private OurUserService ourUserService;

    Dotenv dotenv = Dotenv.load();
    private String mercadoPagoToken = dotenv.get("MERCADOPAGO_TOKEN");

    public PaymentResponseDTO processPayment(Integer idCarrito, CardPaymentDTO cardPaymentDTO) {
        try {
            MercadoPagoConfig.setAccessToken(mercadoPagoToken);
            Optional<OurUsers> cliente = ourUserService.buscarPorId(idCarrito);
            OurUsers datos = cliente.get();
            PaymentClient paymentClient = new PaymentClient();
            Carrito carrito = carritoService.getCarrito(idCarrito);
            if (carrito == null || carrito.getDetalles().isEmpty()) {
                throw new RuntimeException("El carrito está vacío o no existe");
            }
            // Calcular el monto total y concatenar descripciones de productos
            BigDecimal totalAmount = BigDecimal.ZERO;
            StringBuilder productDescriptions = new StringBuilder();

            for (CarritoDetalle detalle : carrito.getDetalles()) {
                // Buscar el producto por ID para obtener el nombre
                Optional<Producto> productoOptional = productoService.buscarPorId(detalle.getIdProducto());

                if (productoOptional.isPresent()) {
                    Producto producto = productoOptional.get();

                    // Calcular el monto total del carrito
                    totalAmount = totalAmount.add(BigDecimal.valueOf(detalle.getSubtotal()));

                    // Calcular el subtotal por producto
                    BigDecimal subtotal = BigDecimal.valueOf(detalle.getCantidad()).multiply(BigDecimal.valueOf(detalle.getPrecioUnitario()));

                    // Concatenar el ID del producto, nombre, cantidad, precio unitario y subtotal a las descripciones
                    productDescriptions.append("ID: ")
                            .append(detalle.getIdProducto())
                            .append(", ")
                            .append(producto.getNombre())
                            .append(" (x")
                            .append(detalle.getCantidad())
                            .append(", Precio Unitario: S/")
                            .append(detalle.getPrecioUnitario())
                            .append(", Subtotal: S/")
                            .append(subtotal)
                            .append("); ");
                } else {
                    throw new RuntimeException("Producto con ID " + detalle.getIdProducto() + " no encontrado");
                }
            }



            // Eliminar la coma final y el espacio
            if (productDescriptions.length() > 0) {
                productDescriptions.setLength(productDescriptions.length() - 2);
            }

            // Construir la solicitud de pago
            PaymentCreateRequest paymentCreateRequest = PaymentCreateRequest.builder()
                    .transactionAmount(totalAmount)
                    .token(cardPaymentDTO.getToken())
                    .description(productDescriptions.toString())
                    .installments(cardPaymentDTO.getInstallments())
                    .paymentMethodId(cardPaymentDTO.getPaymentMethodId())
                    .notificationUrl("https://sirenah.onrender.com/public/webhook")
                    .payer(
                            PaymentPayerRequest.builder()
                                    .firstName(datos.getNombre())
                                    .lastName(datos.getApellido())
                                    .email(datos.getEmail())
                                    .identification(
                                            IdentificationRequest.builder()
                                                    .type(cardPaymentDTO.getPayer().getIdentification().getType())
                                                    .number(datos.getDni())
                                                    .build())
                                    .build())
                    .build();

            // Crear el pago
            Payment createdPayment = paymentClient.create(paymentCreateRequest);

            // Retornar la respuesta con ID, estado y detalle
            return new PaymentResponseDTO(
                    createdPayment.getId(),
                    String.valueOf(createdPayment.getStatus()),
                    createdPayment.getStatusDetail());
        } catch (MPApiException apiException) {
            System.out.println(apiException.getApiResponse().getContent());
            throw new MercadoPagoException(apiException.getApiResponse().getContent());
        } catch (MPException exception) {
            System.out.println(exception.getMessage());
            throw new MercadoPagoException(exception.getMessage());
        }
    }

}
