package com.sirenah.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarritoDetalleDTO {
    private int idProducto;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;
}