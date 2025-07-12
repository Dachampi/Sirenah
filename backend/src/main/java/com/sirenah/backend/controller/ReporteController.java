package com.sirenah.backend.controller;

import com.sirenah.backend.dto.ReporteIngresoPorFechaDTO;
import com.sirenah.backend.dto.ReporteVentaDTO;
import com.sirenah.backend.repository.PedidoRepository;
import com.sirenah.backend.service.impl.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/admin/reportes")

public class ReporteController {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ReporteService reporteService;
    @GetMapping("/ventas")
    public List<ReporteVentaDTO> obtenerReporteVentas(
            @RequestParam OffsetDateTime desde,
            @RequestParam OffsetDateTime hasta
    ) {
        return pedidoRepository.obtenerReporteVentasPorFecha(desde, hasta);
    }
    //http://localhost:9090/admin/reportes/ventas?desde=2025-01-01T00:00:00Z&hasta=2025-07-08T18:59:59Z


    @GetMapping("/ingresos")
    public ResponseEntity<List<ReporteIngresoPorFechaDTO>> obtenerIngresos(
            @RequestParam String tipo,
            @RequestParam String desde,
            @RequestParam String hasta
    ) {
        OffsetDateTime fechaDesde = parseFecha(desde);
        OffsetDateTime fechaHasta = parseFecha(hasta);

        List<ReporteIngresoPorFechaDTO> reporte = reporteService.obtenerIngresosAgrupados(tipo, fechaDesde, fechaHasta);
        return ResponseEntity.ok(reporte);
    }
    public OffsetDateTime parseFecha(String texto) {
        try {
            return OffsetDateTime.parse(texto.trim());
        } catch (DateTimeParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fecha inválida: " + texto);
        }
    }
    //http://localhost:9090/admin/reportes/ingresos?tipo=anio&desde=2025-01-01T00:00:00Z&hasta=2025-07-08T23:59:59Z

    

}


