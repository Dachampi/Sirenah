import { useState, useEffect } from "react";
import { obtenerProductosConBajoStock } from "../../services/reportesApi.js";
import "../../styles/Dashboard/ProductosBajoStock.css";

function ProductosBajoStock() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resultado = await obtenerProductosConBajoStock();
      setData(resultado);
    } catch (error) {
      console.error("Error al obtener productos con bajo stock:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="ventas-container">
      <div className="ventas-card">
        <h2 className="ventas-title">⚠️ Productos con Bajo Stock</h2>

        {loading ? (
          <p className="ventas-msg">Cargando productos...</p>
        ) : data.length === 0 ? (
          <p className="ventas-msg">Todos los productos están con stock suficiente.</p>
        ) : (
          <ul className="bajo-stock-lista">
            {data.map((producto) => (
              <li key={producto.idProducto} className="bajo-stock-item">
                <div className="bajo-stock-nombre">{producto.nombre}</div>
                <div className="bajo-stock-info">
                  <span className="stock-actual">Stock: {producto.stock}</span>
                  <span className="stock-minimo">Mínimo: {producto.stockMinimo}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default ProductosBajoStock;
