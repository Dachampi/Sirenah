package com.sirenah.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
@Data
@AllArgsConstructor
@NoArgsConstructor

public class ReporteVentaDTO {
    private Integer idPedido;
    private OffsetDateTime fechaPedido;
    private BigDecimal total;
}
