package com.sirenah.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class CarritoDTO {
    private Integer idUsuario;
    private Integer idPedido;
    private List<CarritoDetalleDTO> detalles;
}

