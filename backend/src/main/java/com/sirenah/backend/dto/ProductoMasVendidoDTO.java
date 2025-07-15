package com.sirenah.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductoMasVendidoDTO {
    private String nombreProducto;
    private Long cantidadTotal;
    private BigDecimal subtotalTotal;

}
