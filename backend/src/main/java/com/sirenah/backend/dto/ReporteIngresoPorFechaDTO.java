package com.sirenah.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ReporteIngresoPorFechaDTO {
    private String periodo;
    private BigDecimal totalIngresos;

}
