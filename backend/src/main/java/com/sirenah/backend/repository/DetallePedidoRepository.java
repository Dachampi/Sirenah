package com.sirenah.backend.repository;

import com.sirenah.backend.dto.ProductoMasVendidoDTO;
import com.sirenah.backend.model.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface DetallePedidoRepository extends JpaRepository<DetallePedido, Integer> {
    @Query("SELECT new com.sirenah.backend.dto.ProductoMasVendidoDTO(d.nombreProducto, SUM(d.cantidad), SUM(d.subtotal)) " +
            "FROM DetallePedido d " +
            "WHERE d.pedido.fechaPedido BETWEEN :desde AND :hasta " +
            "GROUP BY d.nombreProducto " +
            "ORDER BY SUM(d.cantidad) DESC")
    List<ProductoMasVendidoDTO> obtenerProductosMasVendidosPorFechas(
            @Param("desde") OffsetDateTime desde,
            @Param("hasta") OffsetDateTime hasta
    );

}
