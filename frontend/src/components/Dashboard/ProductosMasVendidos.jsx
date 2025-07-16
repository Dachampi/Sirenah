import { useState, useEffect } from "react"
import { Printer, ShoppingCart } from "lucide-react"
import dayjs from "dayjs"
import { obtenerProductosMasVendidos } from "../../services/reportesApi.js"
import "../../styles/Dashboard/ProductosMasVendidos.css"

export default function ProductosMasVendidos() {
  const [tipo, setTipo] = useState("mes")   const [data, setData] = useState([])
  const [totalUnidades, setTotalUnidades] = useState(0)
  const [totalIngresos, setTotalIngresos] = useState(0)
  const [loading, setLoading] = useState(false)
  const [fechaEmision, setFechaEmision] = useState("")   const [usuarioGenerador, setUsuarioGenerador] = useState("Usuario Demo") 
  const fetchData = async () => {
    setLoading(true)
    try {
      const resultado = await obtenerProductosMasVendidos(tipo)
      setData(resultado.productos)
      setTotalUnidades(resultado.totalUnidades)
      setTotalIngresos(resultado.totalIngresos)
    } catch (error) {
      console.error("Error al obtener productos más vendidos:", error)
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

  const formatoTipo = (tipo) => {
    switch (tipo) {
      case "anio":
        return "año"
      case "mes":
        return "mes"
      case "dia":
        return "día"
      default:
        return tipo
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
          }, [tipo]) 
  return (
    <div id="report-to-print" className="report-container-wrapper">
      <div className="report-card">
        <div className="report-header">
          {/* Información de la empresa/organización */}
          <p className="company-name">SIRENAH</p>
          {/* Título principal del reporte */}
          <h1 className="report-main-title">Informe de Productos Más Vendidos</h1>
          {/* Subtítulo con el icono */}
          <h2 className="report-title">
            <ShoppingCart /> Productos Más Vendidos
          </h2>
          <p className="report-description">
            Este informe detalla los productos más vendidos por cantidad y subtotal en el periodo seleccionado,
            proporcionando una visión de la demanda de productos.
          </p>
          {/* Información adicional del reporte */}
          <div className="report-info">
            <p>
              <span className="report-info-label">Periodo:</span> {formatoTipo(tipo)}
            </p>
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
            <div className="date-field">
              <label htmlFor="tipo" className="date-label">
                Periodo:
              </label>
              <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} className="date-input">
                <option value="dia">Día</option>
                <option value="mes">Mes</option>
                <option value="anio">Año</option>
              </select>
            </div>
            <button onClick={fetchData} disabled={loading} className="action-button">
              {loading ? "Cargando..." : "Buscar"}
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
              <p className="message-text">No hay productos vendidos en el periodo seleccionado.</p>
            </div>
          ) : (
            <div className="product-summary-and-list">
              <div className="summary-metrics">
                <p>
                  <span className="summary-label">🧮 Total Unidades Vendidas:</span>{" "}
                  <span className="summary-value">{totalUnidades}</span>
                </p>
                <p>
                  <span className="summary-label">💵 Total Ingresos Generados:</span>{" "}
                  <span className="summary-value">{formatPEN(totalIngresos)}</span>
                </p>
              </div>
              <div className="product-list-container">
                <h3 className="list-title">Detalle de Productos:</h3>
                <ul className="product-list">
                  {data.map((producto, index) => (
                    <li key={index} className="product-item">
                      <div className="product-name">{producto.nombreProducto}</div>
                      <div className="product-info">
                        <span className="product-quantity">🧺 {producto.cantidadTotal} unidades</span>
                        <span className="product-subtotal">💰 {formatPEN(producto.subtotalTotal)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
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
