package com.sirenah.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class ProductoStockBajoDTO {
    private int idProducto;
    private String nombre;
    private int stock;
    private int stockMinimo;

}
