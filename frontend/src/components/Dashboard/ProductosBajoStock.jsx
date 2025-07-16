import { useState, useEffect } from "react"
import { Printer, AlertTriangle } from "lucide-react"
import dayjs from "dayjs"
import { obtenerProductosConBajoStock } from "../../services/reportesApi.js"
import "../../styles/Dashboard/ProductosBajoStock.css"

export default function ProductosBajoStock() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [fechaEmision, setFechaEmision] = useState("")
  const [usuarioGenerador, setUsuarioGenerador] = useState("Usuario Demo")
  const fetchData = async () => {
    setLoading(true)
    try {
      const resultado = await obtenerProductosConBajoStock()
      setData(resultado)
    } catch (error) {
      console.error("Error al obtener productos con bajo stock:", error)
    } finally {
      setLoading(false)
    }
  }

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
          <h1 className="report-main-title">Informe de Productos con Bajo Stock</h1>
          {/* Subtítulo con el icono */}
          <h2 className="report-title">
            <AlertTriangle /> Productos con Bajo Stock
          </h2>
          <p className="report-description">
            Este informe lista los productos cuyo stock actual está por debajo de su nivel mínimo establecido,
            requiriendo atención para evitar quiebres de stock.
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
              <p className="message-text">Cargando productos...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="message-container">
              <p className="message-text">Todos los productos están con stock suficiente.</p>
            </div>
          ) : (
            <div className="low-stock-list-container">
              <h3 className="list-title">Productos a Reabastecer:</h3>
              <ul className="low-stock-list">
                {data.map((producto) => (
                  <li key={producto.idProducto} className="low-stock-item">
                    <div className="low-stock-name">{producto.nombre}</div>
                    <div className="low-stock-info">
                      <span className="stock-actual">Stock Actual: {producto.stock}</span>
                      <span className="stock-minimo">Stock Mínimo: {producto.stockMinimo}</span>
                    </div>
                  </li>
                ))}
              </ul>
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
