package com.sirenah.backend.controller;

import com.sirenah.backend.dto.CardPaymentDTO;
import com.sirenah.backend.dto.PaymentResponseDTO;
import com.sirenah.backend.service.impl.CardPaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import com.sirenah.backend.model.Carrito;

import com.sirenah.backend.service.CarritoService;


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
