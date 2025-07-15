package com.sirenah.backend.service;

import com.sirenah.backend.model.MetodoPago;

import java.util.Optional;

public interface MetodoPagoService {
    MetodoPago guardar(MetodoPago metodoPago);
    Optional<MetodoPago> buscarPorIdTransaccion(String idTransaccion);
    public Optional<MetodoPago> buscarPorId(Integer idPago);
}
