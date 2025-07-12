package com.sirenah.backend.repository;

import com.sirenah.backend.dto.ReporteIngresoPorFechaDTO;
import com.sirenah.backend.dto.ReporteVentaDTO;
import com.sirenah.backend.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Integer> {
    @Query("SELECT new com.sirenah.backend.dto.ReporteVentaDTO(p.idPedido, p.fechaPedido, SUM(d.subtotal)) " +
            "FROM Pedido p JOIN p.detalles d " +
            "WHERE p.fechaPedido BETWEEN :desde AND :hasta " +
            "GROUP BY p.idPedido, p.fechaPedido " +
            "ORDER BY p.fechaPedido DESC")
    List<ReporteVentaDTO> obtenerReporteVentasPorFecha(OffsetDateTime desde, OffsetDateTime hasta);

    @Query("SELECT p.fechaPedido, d.subtotal FROM Pedido p JOIN p.detalles d WHERE p.fechaPedido BETWEEN :desde AND :hasta")
    List<Object[]> obtenerFechasYSubtotales(
            @Param("desde") OffsetDateTime desde,
            @Param("hasta") OffsetDateTime hasta
    );



}
