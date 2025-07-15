import { useState, useEffect } from "react";
import { obtenerProductosMasVendidos } from "../../services/reportesApi.js";
import "../../styles/Dashboard/ProductosMasVendidos.css";

function ProductosMasVendidos() {
  const [tipo, setTipo] = useState("mes");
  const [data, setData] = useState([]);
  const [totalUnidades, setTotalUnidades] = useState(0);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resultado = await obtenerProductosMasVendidos(tipo);
      setData(resultado.productos);
      setTotalUnidades(resultado.totalUnidades);
      setTotalIngresos(resultado.totalIngresos);
    } catch (error) {
      console.error("Error al obtener productos más vendidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tipo]);

  return (
    <div className="ventas-container">
      <div className="ventas-card">
        <h2 className="ventas-title">🛒 Productos Más Vendidos</h2>

        <div className="ventas-form">
          <div className="field">
            <label>Periodo:</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="dia">Día</option>
              <option value="mes">Mes</option>
              <option value="anio">Año</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="ventas-msg">Cargando productos...</p>
        ) : data.length === 0 ? (
          <p className="ventas-msg">No hay productos vendidos.</p>
        ) : (
          <div className="productos-wrapper">
            <div className="resumen">
              <p><strong>🧮 Total Unidades:</strong> {totalUnidades}</p>
              <p><strong>💵 Total Ingresos:</strong> S/. {totalIngresos.toFixed(2)}</p>
            </div>

            <ul className="productos-lista">
              {data.map((producto, index) => (
                <li key={index} className="producto-item">
                  <div className="producto-nombre">{producto.nombreProducto}</div>
                  <div className="producto-info">
                    <span>🧺 {producto.cantidadTotal} unidades</span>
                    <span>💰 S/. {producto.subtotalTotal.toFixed(2)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductosMasVendidos;
