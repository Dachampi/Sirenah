import { useState, useEffect } from "react"
import { Printer, TrendingUp } from 'lucide-react'
import dayjs from "dayjs"
import { obtenerComparativoVentas } from "../../services/reportesApi.js"
import "../../styles/Dashboard/ComparativoVentas.css"

export default function ComparativoVentas() {
  const [tipo, setTipo] = useState("mes")
  const [periodoA, setPeriodoA] = useState("")
  const [periodoB, setPeriodoB] = useState("")
  const [resultado, setResultado] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fechaEmision, setFechaEmision] = useState("")
  const [usuarioGenerador, setUsuarioGenerador] = useState("Usuario Demo")

  const handleBuscar = async () => {
    if (!periodoA || !periodoB) {
      alert("Por favor selecciona ambos periodos para comparar.")
      return
    }
    
    setLoading(true)
    try {
      const data = await obtenerComparativoVentas(tipo, periodoA, periodoB)
      setResultado(data)
    } catch (err) {
      console.error("Error al obtener comparativo:", err)
      alert("Error al obtener los datos del comparativo.")
    } finally {
      setLoading(false)
    }
  }

  const renderInput = (value, onChange, label) => {
    switch (tipo) {
      case "anio":
        return (
          <div className="date-field">
            <label className="date-label">{label}:</label>
            <input
              className="date-input"
              type="number"
              min="2000"
              max="2099"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Año (ej: 2024)"
            />
          </div>
        )
      case "mes":
        return (
          <div className="date-field">
            <label className="date-label">{label}:</label>
            <input
              className="date-input"
              type="month"
              value={value}
              onChange={(e) => {
                const [y, m] = e.target.value.split("-")
                onChange(`${y}-${m}`)
              }}
            />
          </div>
        )
      case "dia":
      default:
        return (
          <div className="date-field">
            <label className="date-label">{label}:</label>
            <input
              className="date-input"
              type="date"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        )
    }
  }

  const formatPEN = (valor) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 2,
    }).format(Number(valor) || 0)

  const handlePrintReport = () => {
    if (!resultado) {
      alert("No hay datos para imprimir.")
      return
    }
    setFechaEmision(dayjs().format("DD/MM/YYYY HH:mm"))
    setTimeout(() => {
      window.print()
    }, 100)
  }

  useEffect(() => {
    setFechaEmision(dayjs().format("DD/MM/YYYY HH:mm"))
  }, [])

  return (
    <div id="report-to-print" className="report-container-wrapper">
      <div className="report-card">
        <div className="report-header">
          <p className="company-name">SIRENAH</p>
          <h1 className="report-main-title">Informe Comparativo de Ventas</h1>
          <h2 className="report-title">
            <TrendingUp /> Comparativo de Ventas por Periodos
          </h2>
          <p className="report-description">
            Este informe proporciona una comparación detallada de los ingresos totales entre dos periodos de tiempo seleccionados,
            permitiendo analizar el rendimiento de ventas y identificar tendencias de crecimiento o decrecimiento.
          </p>
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
            <div className="date-field">
              <label className="date-label">Tipo de Comparación:</label>
              <select 
                className="date-input" 
                value={tipo} 
                onChange={(e) => setTipo(e.target.value)}
              >
                <option value="dia">Por Día</option>
                <option value="mes">Por Mes</option>
                <option value="anio">Por Año</option>
              </select>
            </div>
            
            {renderInput(periodoA, setPeriodoA, "Periodo A")}
            {renderInput(periodoB, setPeriodoB, "Periodo B")}
            
            <button 
              onClick={handleBuscar} 
              disabled={loading || !periodoA || !periodoB} 
              className="action-button"
            >
              {loading ? "Comparando..." : "Comparar Periodos"}
            </button>
            
            <button 
              onClick={handlePrintReport} 
              disabled={!resultado} 
              className="action-button print-button"
            >
              <Printer className="icon-small" />
              Imprimir / Guardar PDF
            </button>
          </div>

          {loading ? (
            <div className="message-container">
              <p className="message-text">Procesando comparativo...</p>
            </div>
          ) : !resultado ? (
            <div className="message-container">
              <p className="message-text">Selecciona los periodos y presiona "Comparar Periodos" para ver los resultados.</p>
            </div>
          ) : (
            <div className="comparativo-results-container">
              <div className="results-grid">
                <div className="result-card summary-card">
                  <h3 className="card-title">📈 Resumen de Ingresos</h3>
                  <div className="summary-content">
                    <p className="period-summary">
                      <span className="period-label">Periodo A:</span>
                      <span className="period-value">{formatPEN(resultado.totalPeriodoA)}</span>
                    </p>
                    <p className="period-summary">
                      <span className="period-label">Periodo B:</span>
                      <span className="period-value">{formatPEN(resultado.totalPeriodoB)}</span>
                    </p>
                  </div>
                </div>

                <div className="result-card difference-card">
                  <h3 className="card-title">📊 Diferencia Absoluta</h3>
                  <div className="difference-content">
                    <p className="difference-type">
                      {resultado.diferencia < 0 ? "Disminución de" : "Incremento de"}:
                    </p>
                    <p 
                      className="difference-value"
                      style={{ color: resultado.diferencia < 0 ? "#dc2626" : "#059669" }}
                    >
                      {formatPEN(Math.abs(resultado.diferencia))}
                    </p>
                    <small className="difference-description">
                      Diferencia entre los ingresos totales de ambos periodos.
                    </small>
                  </div>
                </div>

                <div className="result-card percentage-card">
                  <h3 className="card-title">📈 Porcentaje de Cambio</h3>
                  <div className="percentage-content">
                    <p 
                      className="percentage-value"
                      style={{ color: resultado.porcentaje < 0 ? "#dc2626" : "#059669" }}
                    >
                      {resultado.porcentaje > 0 ? "+" : ""}{resultado.porcentaje.toFixed(2)}%
                    </p>
                    <small className="percentage-description">
                      Variación porcentual del ingreso entre los periodos.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="report-footer">
          <p>&copy; {new Date().getFullYear()} Sirenah. Todos los derechos reservados.</p>
          <p className="confidential-notice">Este documento contiene información confidencial y es para uso interno.</p>
        </div>
      </div>
    </div>
  )
}
