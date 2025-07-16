package com.sirenah.backend.service;

import com.sirenah.backend.model.Pedido;

import java.util.List;
import java.util.Optional;

public interface PedidoService {

    Pedido crearPedido(Pedido pedido);
    Optional<Pedido> obtenerPedidoPorId(Integer idPedido);
    List<Pedido> obtenerTodosPedidos();
    void eliminarPedido(Integer idPedido);
    List<Pedido> obtenerPedidosPorCliente(Integer idCliente);

}
