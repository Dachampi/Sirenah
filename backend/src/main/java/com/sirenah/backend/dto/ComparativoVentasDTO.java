package com.sirenah.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@AllArgsConstructor
@NoArgsConstructor

public class ComparativoVentasDTO {
    private BigDecimal totalPeriodoA;
    private BigDecimal totalPeriodoB;
    private BigDecimal diferencia;
    private double porcentaje;
}
