"use client"

import { useEffect, useState } from "react"
import { Printer, TrendingUp, Calendar } from "lucide-react"
import dayjs from "dayjs"
import "dayjs/locale/es"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LabelList } from "recharts"
import { obtenerCrecimientoMensual } from "../../services/reportesApi.js"
import "../../styles/Dashboard/CrecimientoMensualVentas.css"

export default function CrecimientoMensualVentas() {
  const [desde, setDesde] = useState(dayjs().subtract(5, "month").startOf("month").format("YYYY-MM-DD"))
  const [hasta, setHasta] = useState(dayjs().endOf("month").format("YYYY-MM-DD"))
  const [datos, setDatos] = useState([])
  const [loading, setLoading] = useState(false)
  const [fechaEmision, setFechaEmision] = useState("")
  const [usuarioGenerador, setUsuarioGenerador] = useState("Usuario Demo")
  const [isPrinting, setIsPrinting] = useState(false) 
  const cargarDatos = async () => {
    setLoading(true)
    try {
      const data = await obtenerCrecimientoMensual(`${desde}T00:00:00Z`, `${hasta}T23:59:59Z`)
      setDatos(data)
    } catch (err) {
      console.error("Error al obtener crecimiento mensual:", err)
      alert("Error al obtener los datos de crecimiento mensual.")
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

  const formatMonth = (mes) => dayjs(mes).format("MMMM YYYY")

  const calcularDiferencia = (index) => {
    if (index === 0) return null
    return datos[index].total - datos[index - 1].total
  }

  const totalPeriodo = datos.reduce((acc, curr) => acc + curr.total, 0)

  const dataChart = datos.map((item) => ({
    mes: dayjs(item.mes).format("MMM YYYY"),
    total: item.total,
    variacion: item.variacionPorcentual ?? 0,
  }))

  const handlePrintReport = () => {
    if (datos.length === 0) {
      alert("No hay datos para imprimir.")
      return
    }
    setIsPrinting(true)     setFechaEmision(dayjs().format("DD/MM/YYYY HH:mm"))
    setTimeout(() => {
      window.print()
      setIsPrinting(false)     }, 500)   }

  useEffect(() => {
    dayjs.locale("es")
    setFechaEmision(dayjs().format("DD/MM/YYYY HH:mm"))
    cargarDatos()
  }, [])

  return (
    <div id="report-to-print" className="report-container-wrapper">
      <div className="report-card">
        <div className="report-header">
          <p className="company-name">SIRENAH</p>
          <h1 className="report-main-title">Informe de Crecimiento Mensual de Ventas</h1>
          <h2 className="report-title">
            <TrendingUp /> Análisis de Crecimiento Mensual
          </h2>
          <p className="report-description">
            Este informe proporciona un análisis detallado del crecimiento mensual de ventas, mostrando la evolución de
            los ingresos mes a mes, las variaciones porcentuales y las tendencias de crecimiento o decrecimiento en el
            periodo seleccionado.
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
              <label className="date-label">Desde:</label>
              <input
                className="date-input"
                type="month"
                value={desde.slice(0, 7)}
                onChange={(e) => {
                  const [y, m] = e.target.value.split("-")
                  setDesde(`${y}-${m}-01`)
                }}
              />
            </div>

            <div className="date-field">
              <label className="date-label">Hasta:</label>
              <input
                className="date-input"
                type="month"
                value={hasta.slice(0, 7)}
                onChange={(e) => {
                  const [y, m] = e.target.value.split("-")
                  const endOfMonth = dayjs(`${y}-${m}-01`).endOf("month").format("YYYY-MM-DD")
                  setHasta(endOfMonth)
                }}
              />
            </div>

            <button onClick={cargarDatos} disabled={loading} className="action-button">
              {loading ? "Cargando..." : "Actualizar Datos"}
            </button>

            <button onClick={handlePrintReport} disabled={datos.length === 0} className="action-button print-button">
              <Printer className="icon-small" />
              Imprimir / Guardar PDF
            </button>
          </div>

          {loading ? (
            <div className="message-container">
              <p className="message-text">Cargando datos de crecimiento mensual...</p>
            </div>
          ) : datos.length === 0 ? (
            <div className="message-container">
              <p className="message-text">No hay datos disponibles para el rango de fechas seleccionado.</p>
            </div>
          ) : (
            <div className="crecimiento-content">
              {/* Resumen del periodo */}
              <div className="summary-metrics">
                <p>
                  <span className="summary-label">💰 Total Vendido en el Periodo:</span>
                  <span className="summary-value">{formatPEN(totalPeriodo)}</span>
                </p>
                <p>
                  <span className="summary-label">📅 Periodo Analizado:</span>
                  <span className="summary-value">
                    {formatMonth(datos[0]?.mes)} - {formatMonth(datos[datos.length - 1]?.mes)}
                  </span>
                </p>
              </div>

              {/* Cards de crecimiento mensual */}
              <div className="monthly-growth-section">
                <h3 className="section-title">📊 Detalle Mensual de Ventas</h3>
                <div className="monthly-cards-grid">
                  {datos.map((item, index) => {
                    const diferencia = calcularDiferencia(index)
                    const variacion = item.variacionPorcentual
                    const clase = variacion > 0 ? "positive" : variacion < 0 ? "negative" : "neutral"
                    const flecha = variacion > 0 ? "⬆️" : variacion < 0 ? "⬇️" : "➖"

                    return (
                      <div className={`monthly-card ${clase}`} key={index}>
                        <div className="monthly-card-header">
                          <h4 className="monthly-card-title">{formatMonth(item.mes)}</h4>
                          <Calendar className="monthly-card-icon" />
                        </div>
                        <div className="monthly-card-content">
                          <div className="monthly-total">
                            <span className="monthly-total-label">Total Vendido:</span>
                            <span className="monthly-total-value">{formatPEN(item.total)}</span>
                          </div>
                          <div className="monthly-variation">
                            <span className="variation-text">
                              {variacion === null
                                ? "Sin datos anteriores"
                                : `${flecha} ${Math.abs(variacion).toFixed(2)}% respecto al mes anterior`}
                            </span>
                          </div>
                          {diferencia !== null && (
                            <div className="monthly-difference">
                              <span className="difference-text">
                                Diferencia: {diferencia >= 0 ? "+" : ""}
                                {formatPEN(diferencia)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Gráfico de barras */}
              <div className="chart-section">
                <h3 className="section-title">📈 Gráfica de Evolución Mensual</h3>
                <div className="chart-container">
                  {isPrinting ? (
                                        <BarChart
                      data={dataChart}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                      barCategoryGap="10%"
                      width={700}                       height={350}                     >
                      <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="mes"
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        interval={0}
                      />
                      <YAxis
                        tickFormatter={(value) => `S/. ${value.toLocaleString()}`}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                      />
                      <Tooltip
                        formatter={(value) => [formatPEN(value), "Total Vendido"]}
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderRadius: 8,
                          border: "1px solid #e5e7eb",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Vendido" maxBarSize={60}>
                        <LabelList
                          dataKey="total"
                          position="top"
                          formatter={(value) => `S/. ${value.toLocaleString()}`}
                          style={{ fontSize: "10px", fill: "#374151" }}
                        />
                      </Bar>
                    </BarChart>
                  ) : (
                                        <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={dataChart}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        barCategoryGap="10%"
                      >
                        <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="mes"
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                          interval={0}
                        />
                        <YAxis
                          tickFormatter={(value) => `S/. ${value.toLocaleString()}`}
                          tick={{ fontSize: 12, fill: "#6b7280" }}
                        />
                        <Tooltip
                          formatter={(value) => [formatPEN(value), "Total Vendido"]}
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Vendido" maxBarSize={60}>
                          <LabelList
                            dataKey="total"
                            position="top"
                            formatter={(value) => `S/. ${value.toLocaleString()}`}
                            style={{ fontSize: "10px", fill: "#374151" }}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
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
