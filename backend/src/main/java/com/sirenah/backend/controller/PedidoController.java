package com.sirenah.backend.controller;

import com.sirenah.backend.model.Pedido;
import com.sirenah.backend.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/todosroles/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;


    @PostMapping("/Crear")
    public ResponseEntity<Pedido> crearPedido(@RequestBody Pedido pedido) {
        Pedido nuevoPedido = pedidoService.crearPedido(pedido);
        return new ResponseEntity<>(nuevoPedido, HttpStatus.CREATED);
    }

    @GetMapping("/{idPedido}")
    public ResponseEntity<Pedido> obtenerPedidoPorId(@PathVariable Integer idPedido) {
        Optional<Pedido> pedido = pedidoService.obtenerPedidoPorId(idPedido);
        return pedido.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping
    public ResponseEntity<List<Pedido>> obtenerTodosPedidos() {
        List<Pedido> pedidos = pedidoService.obtenerTodosPedidos();
        return ResponseEntity.ok(pedidos);
    }


    @DeleteMapping("/{idPedido}")
    public ResponseEntity<Void> eliminarPedido(@PathVariable Integer idPedido) {
        try {
            pedidoService.eliminarPedido(idPedido);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/ObtenerPorCliente/{idCliente}")
    public ResponseEntity<List<Pedido>> obtenerPedidosPorCliente(@PathVariable Integer idCliente) {
        List<Pedido> pedidos = pedidoService.obtenerPedidosPorCliente(idCliente);
        return ResponseEntity.ok(pedidos);
    }


}
