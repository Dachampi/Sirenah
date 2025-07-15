package com.sirenah.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CrecimientoMensualDTO {
    private String mes;
    private BigDecimal total;
    private BigDecimal variacionPorcentual;
}
