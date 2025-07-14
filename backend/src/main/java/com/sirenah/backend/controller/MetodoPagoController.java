package com.sirenah.backend.controller;

import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/todosroles/MercadoPago")
public class MetodoPagoController {

    @Value("${mercadopago.token}")
    private String mercadoPagoAccessToken;
    @Value("${vite.api}")
    private String viteapi;
    @GetMapping("/ProcederPagar")
    public String mercado() throws MPException, MPApiException {

        MercadoPagoConfig.setAccessToken(mercadoPagoAccessToken);

        PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                        .success(viteapi +"/success")
                        .pending(viteapi +"/pending")
                        .failure(viteapi +"/failure")
                        .build();

        PreferenceItemRequest itemRequest =
                PreferenceItemRequest.builder()
                        .id("1234")
                        .title("Games")
                        .description("PS5")
                        .pictureUrl("http://picture.com/PS5")
                        .categoryId("games")
                        .quantity(2)
                        .currencyId("BRL")
                        .unitPrice(new BigDecimal("4000"))
                        .build();
        List<PreferenceItemRequest> items = new ArrayList<>();

        items.add(itemRequest);

        PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                .items(items).backUrls(backUrls).build();

        PreferenceClient client = new PreferenceClient();
        Preference preference = client.create(preferenceRequest);

        return preference.getSandboxInitPoint();
    }


}
