package com.sirenah.backend.service.impl;

import com.sirenah.backend.model.MetodoPago;
import com.sirenah.backend.repository.MetodoPagoRepository;
import com.sirenah.backend.service.MetodoPagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MetodoPagoServiceImpl implements MetodoPagoService {

    @Autowired
    private MetodoPagoRepository metodoPagoRepository;

    @Override
    public MetodoPago guardar(MetodoPago metodoPago) {
        return metodoPagoRepository.save(metodoPago);
    }

    @Override
    public Optional<MetodoPago> buscarPorIdTransaccion(String idTransaccion) {
        return metodoPagoRepository.findByIdTransaccion(idTransaccion);
    }
    @Override
    public Optional<MetodoPago> buscarPorId(Integer idPago) {
        return metodoPagoRepository.findById(idPago);
    }

    @Override
    public List<MetodoPago> obtenerPagosPorCliente(Long idCliente) {
        return metodoPagoRepository.findByPedidoIdCliente(idCliente);
    }


}
