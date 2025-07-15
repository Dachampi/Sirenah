import { useState, useEffect } from "react";
import { obtenerValorTotalInventario } from "../../services/reportesApi.js";
import "../../styles/Dashboard/ValorInventario.css";

function ValorInventario() {
  const [data, setData] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const resultado = await obtenerValorTotalInventario();
      setData(resultado.productos);
      setValorTotal(resultado.valorTotalInventario);
    } catch (error) {
      console.error("Error al obtener valor del inventario:", error);
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
        <h2 className="ventas-title">📦 Valor Total del Inventario</h2>

        {loading ? (
          <p className="ventas-msg">Cargando inventario...</p>
        ) : (
          <>
            <div className="valor-inventario-total">
              Total Inventario: <strong>S/. {valorTotal.toFixed(2)}</strong>
            </div>

            <div className="inventario-tabla-wrapper">
              <table className="inventario-tabla">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    <th>Valor Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((prod) => (
                    <tr key={prod.idProducto}>
                      <td>{prod.nombre}</td>
                      <td>{prod.stock}</td>
                      <td>S/. {prod.precio.toFixed(2)}</td>
                      <td>S/. {prod.valorTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ValorInventario;
