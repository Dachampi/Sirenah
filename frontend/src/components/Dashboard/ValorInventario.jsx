import { useState, useEffect } from "react"
import { Printer, Package } from "lucide-react"
import dayjs from "dayjs"
import { obtenerValorTotalInventario } from "../../services/reportesApi.js"
import "../../styles/Dashboard/ValorInventario.css";

export default function ValorInventario() {
  const [data, setData] = useState([])
  const [valorTotal, setValorTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [fechaEmision, setFechaEmision] = useState("")
  const [usuarioGenerador, setUsuarioGenerador] = useState("Usuario Demo")
  const fetchData = async () => {
    setLoading(true)
    try {
      const resultado = await obtenerValorTotalInventario()
      setData(resultado.productos)
      setValorTotal(resultado.valorTotalInventario)
    } catch (error) {
      console.error("Error al obtener valor del inventario:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPEN = (valor) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(Number(valor) || 0)

    const handlePrintReport = () => {
    if (data.length === 0) {
      alert("No hay datos para imprimir.")
      return
    }
    setFechaEmision(dayjs().format("DD/MM/YYYY HH:mm"))
    setTimeout(() => {
      window.print()
    }, 100)
  }

  useEffect(() => {
    fetchData()
    setFechaEmision(dayjs().format("DD/MM/YYYY HH:mm"))
          }, []) 
  return (
    <div id="report-to-print" className="report-container-wrapper">
      <div className="report-card">
        <div className="report-header">
          {/* Información de la empresa/organización */}
          <p className="company-name">SIRENAH</p>
          {/* Título principal del reporte */}
          <h1 className="report-main-title">Informe de Valor Total del Inventario</h1>
          {/* Subtítulo con el icono */}
          <h2 className="report-title">
            <Package /> Valor Total del Inventario
          </h2>
          <p className="report-description">
            Este informe proporciona una visión general del valor monetario total de los productos en inventario,
            desglosado por cada artículo.
          </p>
          {/* Información adicional del reporte */}
          <div className="report-info">
            <p>
              <span className="report-info-label">Fecha de Emisión:</span> {fechaEmision}
            </p>
            <p>
              <span className="report-info-label">Generado por:</span> {usuarioGenerador}
            </p>
            <p>
              <span className="report-info-label">Versión del Reporte:</span> 1.0
            </p>
          </div>
        </div>
        <div className="report-content">
          <div className="date-filter-controls">
            {/* No hay filtros de fecha o tipo para este reporte, solo el botón de buscar/actualizar */}
            <button onClick={fetchData} disabled={loading} className="action-button">
              {loading ? "Cargando..." : "Actualizar"}
            </button>
            <button onClick={handlePrintReport} disabled={data.length === 0} className="action-button print-button">
              <Printer className="icon-small" />
              {"Imprimir / Guardar PDF"}
            </button>
          </div>

          {loading ? (
            <div className="message-container">
              <p className="message-text">Cargando inventario...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="message-container">
              <p className="message-text">No hay productos en el inventario.</p>
            </div>
          ) : (
            <div className="inventory-summary-and-table">
              <div className="summary-metrics">
                <p>
                  <span className="summary-label">💰 Valor Total del Inventario:</span>{" "}
                  <span className="summary-value">{formatPEN(valorTotal)}</span>
                </p>
              </div>
              <div className="inventory-table-wrapper">
                <h3 className="list-title">Detalle de Productos en Inventario:</h3>
                <div className="table-responsive">
                  <table className="inventory-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Stock</th>
                        <th>Precio Unitario</th>
                        <th>Valor Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((prod) => (
                        <tr key={prod.idProducto}>
                          <td>{prod.nombre}</td>
                          <td>{prod.stock}</td>
                          <td>{formatPEN(prod.precio)}</td>
                          <td>{formatPEN(prod.valorTotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Pie de página del reporte */}
        <div className="report-footer">
          <p>&copy; {new Date().getFullYear()} Sirenah. Todos los derechos reservados.</p>
          <p className="confidential-notice">Este documento contiene información confidencial y es para uso interno.</p>
        </div>
      </div>
    </div>
  )
}
