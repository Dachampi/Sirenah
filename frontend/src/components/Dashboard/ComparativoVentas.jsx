import { useState } from "react";
import { obtenerComparativoVentas } from "../../services/reportesApi.js";
import "../../styles/Dashboard/ComparativoVentas.css";

function ComparativoVentas() {
  const [tipo, setTipo] = useState("mes");
  const [periodoA, setPeriodoA] = useState("");
  const [periodoB, setPeriodoB] = useState("");
  const [resultado, setResultado] = useState(null);

  const handleBuscar = async () => {
    if (!periodoA || !periodoB) return;
    try {
      const data = await obtenerComparativoVentas(tipo, periodoA, periodoB);
      setResultado(data);
    } catch (err) {
      console.error("Error al obtener comparativo:", err);
    }
  };

  const renderInput = (value, onChange) => {
    switch (tipo) {
      case "anio":
        return (
          <input
            type="number"
            min="2000"
            max="2099"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Año"
          />
        );
      case "mes":
        return (
          <input
            type="month"
            value={value}
            onChange={(e) => {
              const [y, m] = e.target.value.split("-");
              onChange(`${y}-${m}`);
            }}
          />
        );
      case "dia":
      default:
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="comparativo-container">
      <h2 className="comparativo-title">📊 Comparativo de Ventas</h2>
      <p className="comparativo-description">
        Compara los ingresos totales entre dos periodos de tiempo seleccionados.
        Puedes comparar por día, mes o año para analizar el rendimiento de tu
        tienda en diferentes etapas.
      </p>

      <div className="comparativo-form">
        <div className="comparativo-selectores">
          <label>Tipo de comparación:</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="dia">Por Día</option>
            <option value="mes">Por Mes</option>
            <option value="anio">Por Año</option>
          </select>
        </div>

        <div className="comparativo-inputs">
          <div className="comparativo-input">
            <label>Periodo A:</label>
            {renderInput(periodoA, setPeriodoA)}
          </div>
          <div className="comparativo-input">
            <label>Periodo B:</label>
            {renderInput(periodoB, setPeriodoB)}
          </div>
        </div>

        <button className="comparativo-btn" onClick={handleBuscar}>
          🔍 Comparar
        </button>
      </div>

      {resultado && (
        <div className="comparativo-resultados">
          <div className="card diferencia">
            <h3>📈 Resumen de Ingresos</h3>

            <p>
              <strong>Periodo A:</strong> S/.{" "}
              {resultado.totalPeriodoA.toFixed(2)}
            </p>
            <p>
              <strong>Periodo B:</strong> S/.{" "}
              {resultado.totalPeriodoB.toFixed(2)}
            </p>
          </div>
          <div className="card diferencia">
            <h3>📉 Diferencia</h3>

            <p>
              {resultado.diferencia < 0 ? "Disminución de" : "Incremento de"}:{" "}
              <strong
                style={{ color: resultado.diferencia < 0 ? "red" : "green" }}
              >
                S/. {Math.abs(resultado.diferencia).toFixed(2)}
              </strong>
            </p>
            <small>
              Diferencia entre los ingresos totales de ambos periodos.
            </small>
          </div>

          <div className="card porcentaje">
            <h3>📈 Porcentaje de Cambio</h3>
            <p>
              <strong
                style={{ color: resultado.porcentaje < 0 ? "red" : "green" }}
              >
                {resultado.porcentaje.toFixed(2)}%
              </strong>
            </p>
            <small>Variación porcentual del ingreso entre los periodos.</small>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComparativoVentas;
