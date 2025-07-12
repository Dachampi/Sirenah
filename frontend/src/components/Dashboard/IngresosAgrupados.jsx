import { useState } from "react";
import { obtenerIngresos } from "../../services/reportesApi.js";
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
import "../../styles/Dashboard/IngresosAgrupados.css"; // Asegúrate de tener este CSS

function IngresosPorPeriodo() {
  const [tipo, setTipo] = useState("mes"); // "dia", "mes", "anio"
  const [desde, setDesde] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [hasta, setHasta] = useState(dayjs().endOf("month").format("YYYY-MM-DD"));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const desdeUTC = `${desde}T00:00:00Z`;
      const hastaUTC = `${hasta}T23:59:59Z`;

      const resultado = await obtenerIngresos(tipo, desdeUTC, hastaUTC);

      const transformado = resultado.map((item) => ({
        periodo: item.periodo,
        total: item.totalIngresos,
      }));

      setData(transformado);
    } catch (error) {
      console.error("Error al obtener ingresos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ventas-container">
      <div className="ventas-card">
        <h2 className="ventas-title">💰 Ingresos por {tipo}</h2>

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
          <div className="field">
            <label>Agrupar por:</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="dia">Día</option>
              <option value="mes">Mes</option>
              <option value="anio">Año</option>
            </select>
          </div>
          <button onClick={fetchData}>Buscar</button>
        </div>

        {loading ? (
          <p className="ventas-msg">Cargando ingresos...</p>
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
                <XAxis dataKey="periodo" angle={-45} textAnchor="end" height={60} />
                <YAxis tickFormatter={(val) => `S/. ${val}`} />
                <Tooltip
                  formatter={(value) => [`S/. ${value}`, "Total"]}
                  labelFormatter={(label) => `Periodo: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#10b981"
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

export default IngresosPorPeriodo;
