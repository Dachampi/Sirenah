package com.sirenah.backend.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.client.payment.PaymentCreateRequest;
import com.mercadopago.client.payment.PaymentPayerRequest;
import com.mercadopago.resources.payment.Payment;
import com.sirenah.backend.dto.CardPaymentDTO;
import com.sirenah.backend.dto.PaymentResponseDTO;
import com.sirenah.backend.service.impl.CardPaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.common.IdentificationRequest;
import com.mercadopago.client.common.PhoneRequest;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferencePayerRequest;
import com.mercadopago.client.preference.PreferencePaymentMethodsRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import com.mercadopago.resources.preference.PreferenceItem;
import com.sirenah.backend.model.Carrito;
import com.sirenah.backend.model.CarritoDetalle;
import com.sirenah.backend.model.OurUsers;
import com.sirenah.backend.model.Producto;
import com.sirenah.backend.service.CarritoService;
import com.sirenah.backend.service.OurUserService;
import com.sirenah.backend.service.ProductoService;

import io.github.cdimascio.dotenv.Dotenv;

@RestController
@RequestMapping("/public")

public class PagoController {

    @Autowired
    private CardPaymentService cardPaymentService;
    @Autowired
    private CarritoService carritoService;


    @PostMapping("/PagarConTarjeta/{idCarrito}")
    public ResponseEntity<PaymentResponseDTO> processPayment(
            @PathVariable Integer idCarrito,
            @RequestBody CardPaymentDTO cardPaymentDTO) {
        Carrito carrito = carritoService.getCarrito(idCarrito);
        if (carrito == null || carrito.getDetalles().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new PaymentResponseDTO(null, "FAILED", "El carrito está vacío o no existe."));
        }
        PaymentResponseDTO paymentResponse = cardPaymentService.processPayment(idCarrito, cardPaymentDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentResponse);
    }

}
