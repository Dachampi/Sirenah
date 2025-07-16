import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import { obtenerReporteVentas } from "../../services/reportesApi.js";
import "../../styles/Dashboard/VentasPorFecha.css";
import { Printer } from "lucide-react" 

export default function VentasPorFecha() {
  const [desde, setDesde] = useState(dayjs().startOf("month").format("YYYY-MM-DD"))
  const [hasta, setHasta] = useState(dayjs().endOf("month").format("YYYY-MM-DD"))
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [fechaEmision, setFechaEmision] = useState("")     const [usuarioGenerador, setUsuarioGenerador] = useState("Usuario Demo")

  const fetchData = async () => {
    setLoading(true)
    try {
      const desdeLocal = `${desde}T00:00:00Z`
      const hastaLocal = `${hasta}T23:59:59Z`
      const resultado = await obtenerReporteVentas(desdeLocal, hastaLocal)
      const transformado = resultado.map((item) => ({
        fecha: dayjs(item.fechaPedido).format("YYYY-MM-DD"),
        fechaCompleta: dayjs(item.fechaPedido).format("DD/MM/YYYY HH:mm"),
        total: Number.parseFloat(item.total),       }))
      setData(transformado)
    } catch (error) {
      console.error("Error al obtener reporte de ventas:", error)
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
    setFechaEmision(dayjs().format("DD/MM/YYYY HH:mm"))           }, []) 
  return (
    <div id="report-to-print" className="report-container-wrapper">
      <div className="report-card">
        <div className="report-header">
          {/* Información de la empresa/organización */}
          <p className="company-name">SIRENAH</p>
          {/* Título principal del reporte */}
          <h1 className="report-main-title">Informe de Rendimiento de Ventas</h1>
          {/* Subtítulo con el icono */}
          <h2 className="report-title">📈 Ventas por Fecha</h2>
          <p className="report-description">
            Este informe detalla el total de ventas realizadas por día dentro del rango de fechas seleccionado,
            proporcionando una visión clara del rendimiento comercial.
          </p>
          {/* Información adicional del reporte */}
          <div className="report-info">
            <p>
              <span className="report-info-label">Rango de Fechas:</span> {dayjs(desde).format("DD/MM/YYYY")} -{" "}
              {dayjs(hasta).format("DD/MM/YYYY")}
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
              <label htmlFor="desde" className="date-label">
                Desde:
              </label>
              <input
                id="desde"
                type="date"
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
                className="date-input"
              />
            </div>
            <div className="date-field">
              <label htmlFor="hasta" className="date-label">
                Hasta:
              </label>
              <input
                id="hasta"
                type="date"
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
                className="date-input"
              />
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
              <p className="message-text">Cargando datos...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="message-container">
              <p className="message-text">No hay datos en el rango seleccionado.</p>
            </div>
          ) : (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={360}>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="fecha"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tickLine={false}
                    axisLine={false}
                    style={{ fontSize: "0.75rem", fill: "#6b7280" }}
                  />
                  <YAxis
                    tickFormatter={formatPEN}
                    tickLine={false}
                    axisLine={false}
                    style={{ fontSize: "0.75rem", fill: "#6b7280" }}
                  />
                  <Tooltip
                    formatter={(value) => [formatPEN(value), "Total"]}
                    labelFormatter={(label, props) =>
                      props?.[0]?.payload ? `🕓 Venta realizada el ${props[0].payload.fechaCompleta}` : label
                    }
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                      padding: "0.75rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    }}
                    labelStyle={{
                      fontWeight: "600",
                      marginBottom: "0.5rem",
                      color: "#374151",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#3b82f6", stroke: "#ffffff", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "#3b82f6", stroke: "#ffffff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
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

