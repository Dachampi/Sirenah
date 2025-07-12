package com.sirenah.backend.repository;

import com.sirenah.backend.dto.ProductoInventarioDTO;
import com.sirenah.backend.dto.ProductoStockBajoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.sirenah.backend.model.Producto;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer> {
    @Query("SELECT new com.sirenah.backend.dto.ProductoStockBajoDTO(p.idProducto, p.Nombre, p.Stock, p.StockMinimo) " +
            "FROM Producto p WHERE p.Stock <= p.StockMinimo AND p.Estado = true")
    List<ProductoStockBajoDTO> obtenerProductosConBajoStock();
    @Query("SELECT new com.sirenah.backend.dto.ProductoInventarioDTO(p.idProducto, p.Nombre, p.Stock, p.Precio) " +
            "FROM Producto p WHERE p.Estado = true")
    List<ProductoInventarioDTO> obtenerInventarioDetalle();

}
