import { useEffect, useState } from "react";
import { obtenerCrecimientoMensual } from "../../services/reportesApi.js";
import dayjs from "dayjs";
import "dayjs/locale/es";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import "../../styles/Dashboard/CrecimientoMensualVentas.css";

function CrecimientoMensualVentas() {
  const [desde, setDesde] = useState(dayjs().subtract(5, "month").startOf("month").format("YYYY-MM-DD"));
  const [hasta, setHasta] = useState(dayjs().endOf("month").format("YYYY-MM-DD"));
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await obtenerCrecimientoMensual(`${desde}T00:00:00Z`, `${hasta}T23:59:59Z`);
      setDatos(data);
    } catch (err) {
      console.error("Error al obtener crecimiento mensual:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    dayjs.locale("es");
    cargarDatos();
  }, []);

  const formatMonth = (mes) => dayjs(mes).format("MMMM YYYY");

  const calcularDiferencia = (index) => {
    if (index === 0) return null;
    return datos[index].total - datos[index - 1].total;
  };

  const totalPeriodo = datos.reduce((acc, curr) => acc + curr.total, 0);

  const dataChart = datos.map((item) => ({
    mes: dayjs(item.mes).format("MMM YYYY"),
    total: item.total,
    variacion: item.variacionPorcentual ?? 0,
  }));

  return (
    <div className="crecimiento-container">
      <h2 className="crecimiento-title">📅📊 Crecimiento Mensual de Ventas</h2>
      <p className="crecimiento-description">
        Visualiza el total de ventas por mes y la variación porcentual respecto al mes anterior. También puedes ver la diferencia absoluta en soles.
      </p>

      <div className="crecimiento-filtros">
        <div className="crecimiento-fecha">
          <label>Desde:</label>
          <input
            type="month"
            value={desde.slice(0, 7)}
            onChange={(e) => {
              const [y, m] = e.target.value.split("-");
              setDesde(`${y}-${m}-01`);
            }}
          />
        </div>
        <div className="crecimiento-fecha">
          <label>Hasta:</label>
          <input
            type="month"
            value={hasta.slice(0, 7)}
            onChange={(e) => {
              const [y, m] = e.target.value.split("-");
              const endOfMonth = dayjs(`${y}-${m}-01`).endOf("month").format("YYYY-MM-DD");
              setHasta(endOfMonth);
            }}
          />
        </div>
        <button onClick={cargarDatos}>Buscar</button>
      </div>

      {loading ? (
        <p className="crecimiento-loading">Cargando datos...</p>
      ) : datos.length === 0 ? (
        <p className="crecimiento-msg">No hay datos disponibles para el rango seleccionado.</p>
      ) : (
        <>
          <div className="crecimiento-resultados">
            {datos.map((item, index) => {
              const diferencia = calcularDiferencia(index);
              const variacion = item.variacionPorcentual;
              const clase = variacion > 0 ? "bg-positivo" : variacion < 0 ? "bg-negativo" : "bg-neutro";
              const flecha = variacion > 0 ? "⬆️" : variacion < 0 ? "⬇️" : "➖";
              return (
                <div className={`crecimiento-card ${clase}`} key={index}>
                  <h3>{formatMonth(item.mes)}</h3>
                  <p>Total vendido:</p>
                  <strong>S/. {item.total.toFixed(2)}</strong>
                  <p
                    className="variacion"
                    title={`Comparado con ${index > 0 ? formatMonth(datos[index - 1].mes) : 'N/A'}`}
                  >
                    {variacion === null
                      ? "Sin datos anteriores"
                      : `${flecha} ${variacion.toFixed(2)}% respecto al mes anterior`}
                  </p>
                  {diferencia !== null && (
                    <small>
                      Diferencia: {diferencia >= 0 ? "+" : "-"}S/. {Math.abs(diferencia).toFixed(2)}
                    </small>
                  )}
                </div>
              );
            })}
          </div>

          <div className="crecimiento-chart-container">
            <h3>📈 Gráfica de Total Vendido</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={dataChart}
                margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
                barSize={50}
              >
                <CartesianGrid strokeDasharray="4 4" stroke="#ccc" />
                <XAxis dataKey="mes" tick={{ fontSize: 12 }} angle={-15} textAnchor="end" />
                <YAxis tickFormatter={(value) => `S/. ${value}`} />
                <Tooltip
                  formatter={(value) => `S/. ${value.toFixed(2)}`}
                  contentStyle={{ backgroundColor: "#f9f9f9", borderRadius: 8, border: "1px solid #ddd" }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="total" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Total Vendido">
                  <LabelList dataKey="total" position="top" formatter={(value) => `S/. ${value}`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="crecimiento-resumen-final">
            <h4>🧾 Total vendido en el periodo:</h4>
            <p className="total-sumado">S/. {totalPeriodo.toFixed(2)}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default CrecimientoMensualVentas;
