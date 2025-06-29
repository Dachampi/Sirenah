package com.sirenah.backend.controller;


import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.payment.PaymentClient;
import com.mercadopago.resources.payment.Payment;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/public/webhook")
public class WebhookController {
    Dotenv dotenv = Dotenv.load();
    private String mercadoPagoToken = dotenv.get("MERCADOPAGO_TOKEN");
    @PostMapping
    public ResponseEntity<?> handleWebhook(@RequestBody WebhookNotification notification) {
        try {
            System.out.println("Recibido Webhook:");
            System.out.println("ID del Pago: " + notification.getData().getId());
            System.out.println("Tipo de Evento: " + notification.getType());

            if ("payment".equals(notification.getType())) {
                processPayment(notification.getData().getId());
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error procesando el webhook");
        }
    }

    private void processPayment(Long paymentId) {
        try {
            MercadoPagoConfig.setAccessToken(dotenv.get(mercadoPagoToken));

            PaymentClient paymentClient = new PaymentClient();
            Payment payment = paymentClient.get(paymentId);

            // Procesa el estado del pago en tu sistema
            System.out.println("Estado del Pago: " + payment.getStatus());
            System.out.println("Detalles del Pago: " + payment.getDescription());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    static class WebhookNotification {
        private String type;
        private WebhookData data;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public WebhookData getData() {
            return data;
        }

        public void setData(WebhookData data) {
            this.data = data;
        }

        static class WebhookData {
            private Long id;

            public Long getId() {
                return id;
            }

            public void setId(Long id) {
                this.id = id;
            }
        }
    }
}
