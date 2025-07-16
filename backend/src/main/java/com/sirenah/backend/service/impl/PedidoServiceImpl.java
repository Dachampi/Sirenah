package com.sirenah.backend.service.impl;

import com.sirenah.backend.model.DetallePedido;
import com.sirenah.backend.model.Pedido;
import com.sirenah.backend.repository.PedidoRepository;
import com.sirenah.backend.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PedidoServiceImpl implements PedidoService {

    @Autowired
    private  PedidoRepository pedidoRepository;


    @Override
    public Pedido crearPedido(Pedido pedido) {
        for (DetallePedido detalle : pedido.getDetalles()) {
            detalle.setPedido(pedido);
        }
        return pedidoRepository.save(pedido);
    }


    @Override
    public Optional<Pedido> obtenerPedidoPorId(Integer idPedido) {
        return pedidoRepository.findById(idPedido);
    }

    @Override
    public List<Pedido> obtenerTodosPedidos() {
        return pedidoRepository.findAll();
    }

    @Override
    public void eliminarPedido(Integer idPedido) {
        if (pedidoRepository.existsById(idPedido)) {
            pedidoRepository.deleteById(idPedido);
        } else {
            throw new IllegalArgumentException("Pedido no encontrado");
        }
    }

    @Override
    public List<Pedido> obtenerPedidosPorCliente(Integer idCliente) {
        return pedidoRepository.findByIdCliente(idCliente);
    }



}
