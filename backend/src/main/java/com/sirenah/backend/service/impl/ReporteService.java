package com.sirenah.backend.service.impl;

import com.sirenah.backend.dto.*;
import com.sirenah.backend.repository.DetallePedidoRepository;
import com.sirenah.backend.repository.PedidoRepository;
import com.sirenah.backend.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.*;

@Service
public class ReporteService {

    @Autowired
    private PedidoRepository pedidoRepository;
    @Autowired
    private DetallePedidoRepository detallePedidoRepository;
    @Autowired
    private ProductoRepository productoRepository;
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
    public List<ProductoMasVendidoDTO> obtenerProductosMasVendidosPorTipo(String tipo) {
        OffsetDateTime ahora = OffsetDateTime.now();
        OffsetDateTime desde;

        switch (tipo.toLowerCase()) {
            case "dia" -> desde = ahora.toLocalDate().atStartOfDay().atOffset(ahora.getOffset());
            case "semana" -> desde = ahora.minusDays(7);
            case "mes" -> desde = ahora.minusMonths(1);
            case "anio" -> desde = ahora.minusYears(1);
            default -> throw new IllegalArgumentException("Tipo inválido. Usa: dia, semana, mes, anio");
        }

        return detallePedidoRepository.obtenerProductosMasVendidosPorFechas(desde, ahora);
    }

    public Map<String, Object> obtenerProductosMasVendidosConTotales(String tipo) {
        List<ProductoMasVendidoDTO> productos = obtenerProductosMasVendidosPorTipo(tipo);

        Long totalUnidades = productos.stream()
                .mapToLong(ProductoMasVendidoDTO::getCantidadTotal)
                .sum();

        BigDecimal totalIngresos = productos.stream()
                .map(ProductoMasVendidoDTO::getSubtotalTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("productos", productos);
        resultado.put("totalUnidades", totalUnidades);
        resultado.put("totalIngresos", totalIngresos);
        return resultado;
    }
    public List<ProductoStockBajoDTO> obtenerProductosConBajoStock() {
        return productoRepository.obtenerProductosConBajoStock();
    }
    public Map<String, Object> obtenerValorInventario() {
        List<ProductoInventarioDTO> productos = productoRepository.obtenerInventarioDetalle();

        BigDecimal valorTotal = productos.stream()
                .map(ProductoInventarioDTO::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> resultado = new HashMap<>();
        resultado.put("productos", productos);
        resultado.put("valorTotalInventario", valorTotal);
        return resultado;
    }
    public ComparativoVentasDTO compararPorTipoYPeriodo(String tipo, String periodoA, String periodoB) {
        String formato;
        switch (tipo.toLowerCase()) {
            case "anio" -> formato = "%Y";
            case "mes" -> formato = "%Y-%m";
            case "semana" -> formato = "%x-%v";
            case "dia" -> formato = "%Y-%m-%d";
            default -> throw new IllegalArgumentException("Tipo inválido");
        }

        BigDecimal totalA = pedidoRepository.obtenerTotalPorPeriodo(periodoA, formato);
        BigDecimal totalB = pedidoRepository.obtenerTotalPorPeriodo(periodoB, formato);

        if (totalA == null) totalA = BigDecimal.ZERO;
        if (totalB == null) totalB = BigDecimal.ZERO;

        BigDecimal diferencia = totalB.subtract(totalA);
        double porcentaje = (totalA.compareTo(BigDecimal.ZERO) == 0) ? 0.0 :
                diferencia.divide(totalA, 2, RoundingMode.HALF_UP).doubleValue() * 100;

        return new ComparativoVentasDTO(totalA, totalB, diferencia, porcentaje);
    }
    public List<CrecimientoMensualDTO> calcularCrecimientoMensual(OffsetDateTime desde, OffsetDateTime hasta) {
        List<Object[]> datos = pedidoRepository.obtenerTotalesPorMes(desde, hasta);
        List<CrecimientoMensualDTO> resultado = new ArrayList<>();

        BigDecimal totalAnterior = null;

        for (Object[] fila : datos) {
            String mes = (String) fila[0];
            BigDecimal total = (BigDecimal) fila[1];
            BigDecimal variacion = null;

            if (totalAnterior != null && totalAnterior.compareTo(BigDecimal.ZERO) > 0) {
                variacion = total.subtract(totalAnterior)
                        .divide(totalAnterior, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100));
            }

            resultado.add(new CrecimientoMensualDTO(mes, total, variacion));
            totalAnterior = total;
        }

        return resultado;
    }

}

