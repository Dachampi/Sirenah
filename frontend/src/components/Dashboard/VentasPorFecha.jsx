import { useState } from "react";
import { obtenerReporteVentas } from "../../services/reportesApi.js";
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
import "../../styles/Dashboard/VentasPorFecha.css";

function VentasPorFecha() {
  const [desde, setDesde] = useState(
    dayjs().startOf("month").format("YYYY-MM-DD")
  );
  const [hasta, setHasta] = useState(
    dayjs().endOf("month").format("YYYY-MM-DD")
  );
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const desdeLocal = `${desde}T00:00:00Z`;
      const hastaLocal = `${hasta}T23:59:59Z`;
      const resultado = await obtenerReporteVentas(desdeLocal, hastaLocal);

      const transformado = resultado.map((item) => ({
        fecha: dayjs(item.fechaPedido).format("YYYY-MM-DD"),
        fechaCompleta: dayjs(item.fechaPedido).format("DD/MM/YYYY HH:mm"),
        total: item.total,
      }));

      setData(transformado);
    } catch (error) {
      console.error("Error al obtener reporte de ventas:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ventas-container">
      <div className="ventas-card">
        <h2 className="ventas-title">📈 Ventas por Fecha</h2>

        <div className="ventas-form">
          <div className="field">
            <label>Desde:</label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Hasta:</label>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
            />
          </div>
          <button onClick={fetchData}>Buscar</button>
        </div>

        {loading ? (
          <p className="ventas-msg">Cargando datos...</p>
        ) : data.length === 0 ? (
          <p className="ventas-msg">No hay datos en el rango seleccionado.</p>
        ) : (
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={360}>
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="fecha"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tickFormatter={(value) => `S/. ${value}`} />
                <Tooltip
                  formatter={(value) => [`S/. ${value}`, "Total"]}
                  labelFormatter={(label, props) =>
                    props?.[0]?.payload
                      ? `🕓 Venta realizada el ${props[0].payload.fechaCompleta}`
                      : label
                  }
                />

                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

export default VentasPorFecha;
