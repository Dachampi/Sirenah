package com.sirenah.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductoInventarioDTO {
    private int idProducto;
    private String nombre;
    private int stock;
    private double precio;
    private BigDecimal valorTotal;
    public ProductoInventarioDTO(int idProducto, String nombre, int stock, double precio) {
        this.idProducto = idProducto;
        this.nombre = nombre;
        this.stock = stock;
        this.precio = precio;
        this.valorTotal = BigDecimal.valueOf(precio).multiply(BigDecimal.valueOf(stock));
    }
}
