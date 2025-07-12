package com.sirenah.backend.service.impl;

import com.sirenah.backend.dto.ReporteIngresoPorFechaDTO;
import com.sirenah.backend.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
public class ReporteService {

    @Autowired
    private PedidoRepository pedidoRepository;

    public List<ReporteIngresoPorFechaDTO> obtenerIngresosAgrupados(String tipo, OffsetDateTime desde, OffsetDateTime hasta) {
        List<Object[]> resultados = pedidoRepository.obtenerFechasYSubtotales(desde, hasta);
        Map<String, BigDecimal> agrupado = new TreeMap<>();

        for (Object[] row : resultados) {
            OffsetDateTime fecha = (OffsetDateTime) row[0];
            BigDecimal subtotal = (BigDecimal) row[1];

            String clave;
            switch (tipo.toLowerCase()) {
                case "dia" -> clave = fecha.toLocalDate().toString(); // "2025-07-08"
                case "mes" -> clave = fecha.getYear() + "-" + String.format("%02d", fecha.getMonthValue()); // "2025-07"
                case "anio" -> clave = String.valueOf(fecha.getYear()); // "2025"
                default -> throw new IllegalArgumentException("Tipo inválido: debe ser 'dia', 'mes' o 'anio'");
            }

            agrupado.put(clave, agrupado.getOrDefault(clave, BigDecimal.ZERO).add(subtotal));
        }

        return agrupado.entrySet().stream()
                .map(entry -> new ReporteIngresoPorFechaDTO(entry.getKey(), entry.getValue()))
                .toList();
    }
}

