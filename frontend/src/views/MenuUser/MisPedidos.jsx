import { useState, useEffect } from "react";
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
} from "lucide-react";
import UserSidebar from "../../components/layout/UserSidebar";
import { obtenerUsuarioId } from "../../services/todosroles";
import Loading from "../../components/common/Loanding";
import PedidoDetalleModal from "./PedidoDetalleModal";
import "../../styles/stylesUser/MisPedidos.css";

const normalizarEstado = (estado) => {
  const estadoLimpio = estado.toLowerCase().trim();
  const mapeoEstados = {
    pendiente: "pendiente",
    pendiende: "pendiente",     
    pendente: "pendiente",     
    confirmado: "confirmado",
    confirmdo: "confirmado",     
    enviado: "enviado",
    entregado: "entregado",
    entregdo: "entregado",     
    cancelado: "cancelado",
    canceldo: "cancelado",   
  };
  return mapeoEstados[estadoLimpio] || estadoLimpio;
};

function MisPedidos() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const handleCollapseChange = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  const abrirDetalles = (pedido) => {
    setPedidoSeleccionado(pedido);
  };

  const cerrarDetalles = () => {
    setPedidoSeleccionado(null);
  };

  const getEstadoIcon = (estado) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return <Clock className="pedido-estado-icon" />;
      case "confirmado":
        return <CheckCircle className="pedido-estado-icon" />;
      case "enviado":
        return <Truck className="pedido-estado-icon" />;
      case "entregado":
        return <CheckCircle className="pedido-estado-icon" />;
      case "cancelado":
        return <XCircle className="pedido-estado-icon" />;
      default:
        return <Clock className="pedido-estado-icon" />;
    }
  };

  const getEstadoClass = (estado) => {
    switch (estado.toLowerCase()) {
      case "pendiente":
        return "pedido-estado-pendiente";
      case "confirmado":
        return "pedido-estado-confirmado";
      case "enviado":
        return "pedido-estado-enviado";
      case "entregado":
        return "pedido-estado-entregado";
      case "cancelado":
        return "pedido-estado-cancelado";
      default:
        return "pedido-estado-pendiente";
    }
  };

    const pedidosFiltradosYOrdenados = pedidos
    .filter((pedido) => {
      if (filtroEstado === "todos") return true;
      const estadoPedido = pedido.estado.toLowerCase().trim();
      const filtroNormalizado = filtroEstado.toLowerCase().trim();
      return estadoPedido === filtroNormalizado;
    })
    .sort((a, b) => {
            return (
        new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime()
      );
    });

  useEffect(() => {
    const fetchUsuarioId = async () => {
      try {
        const id = await obtenerUsuarioId();
        setUsuarioId(id);
      } catch (error) {
        console.error("Error al obtener ID del usuario:", error);
      }
    };
    fetchUsuarioId();
  }, []);

  useEffect(() => {
    const obtenerPedidos = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${
            import.meta.env.VITE_API
          }/todosroles/pedidos/ObtenerPorCliente/${usuarioId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("No se pudieron obtener los pedidos");
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (usuarioId) {
      obtenerPedidos();
    }
  }, [usuarioId]);

  useEffect(() => {
    if (pedidos.length > 0) {
      console.log("Estados únicos encontrados:", [
        ...new Set(pedidos.map((p) => p.estado.toLowerCase().trim())),
      ]);
      console.log("Total de pedidos:", pedidos.length);
      console.log("Filtro actual:", filtroEstado);
      console.log("Pedidos filtrados:", pedidosFiltradosYOrdenados.length);
    }
  }, [pedidos, filtroEstado, pedidosFiltradosYOrdenados.length]);

  return (
    <div className="Usuario-layout">
      <UserSidebar onCollapseChange={handleCollapseChange} />
      <main className={`content ${isCollapsed ? "collapsed" : ""}`}>
        <div className="pedido-header-section">
          <div className="pedido-title-container">
            <Package className="pedido-title-icon" />
            <h1 className="pedido-title">Mis Pedidos</h1>
          </div>
          <p className="pedido-subtitle">
            Gestiona y revisa el estado de todos tus pedidos
          </p>
        </div>
        <div className="pedido-filters-container">
          <div className="pedido-filter-group">
            <label className="pedido-filter-label">Filtrar por estado:</label>
            <select
              className="pedido-filter-select"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos los pedidos</option>
              <option value="pendiente">Pendientes</option>
              <option value="confirmado">Confirmados</option>
              <option value="enviado">Enviados</option>
              <option value="entregado">Entregados</option>
              <option value="cancelado">Cancelados</option>
            </select>
          </div>
          <div className="pedido-stats">
            <span className="pedido-total-count">
              {pedidosFiltradosYOrdenados.length}{" "}
              {pedidosFiltradosYOrdenados.length === 1 ? "pedido" : "pedidos"}
            </span>
          </div>
        </div>
        {isLoading ? (
          <div className="pedido-loading-container">
            <Loading />
          </div>
        ) : (
          <div className="pedido-content-container">
            {pedidosFiltradosYOrdenados.length === 0 ? (
              <div className="pedido-empty-state">
                <Package className="pedido-empty-icon" />
                <h3 className="pedido-empty-title">
                  {filtroEstado === "todos"
                    ? "No tienes pedidos realizados"
                    : `No tienes pedidos ${filtroEstado}s`}
                </h3>
                <p className="pedido-empty-description">
                  {filtroEstado === "todos"
                    ? "Cuando realices tu primer pedido, aparecerá aquí."
                    : "Prueba cambiando el filtro para ver otros pedidos."}
                </p>
              </div>
            ) : (
              <div className="pedido-grid-container">
                {pedidosFiltradosYOrdenados.map((pedido) => {
                  const total = pedido.detalles.reduce(
                    (acc, d) => acc + d.subtotal,
                    0
                  );
                  return (
                    <div key={pedido.idPedido} className="pedido-card">
                      <div className="pedido-card-header">
                        <div className="pedido-fecha-container">
                          <Calendar className="pedido-fecha-icon" />
                          <span className="pedido-fecha">
                            {new Date(pedido.fechaPedido).toLocaleDateString(
                              "es-ES",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                        <div
                          className={`pedido-estado-badge ${getEstadoClass(
                            pedido.estado
                          )}`}
                        >
                          {getEstadoIcon(pedido.estado)}
                          <span className="pedido-estado-text">
                            {normalizarEstado(pedido.estado)}
                          </span>
                        </div>
                      </div>
                      <div className="pedido-card-body">
                        <div className="pedido-info-grid">
                          <div className="pedido-info-item">
                            <Package className="pedido-info-icon" />
                            <div className="pedido-info-content">
                              <span className="pedido-info-label">
                                Artículos
                              </span>
                              <span className="pedido-info-value">
                                {pedido.detalles.length}
                              </span>
                            </div>
                          </div>
                          <div className="pedido-info-item">
                            <CreditCard className="pedido-info-icon" />
                            <div className="pedido-info-content">
                              <span className="pedido-info-label">Total</span>
                              <span className="pedido-info-value pedido-total-amount">
                                S/. {total.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="pedido-direccion-container">
                          <MapPin className="pedido-direccion-icon" />
                          <div className="pedido-direccion-content">
                            <span className="pedido-direccion-label">
                              Dirección de entrega
                            </span>
                            <span className="pedido-direccion-text">
                              {pedido.direccion}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="pedido-card-footer">
                        <button
                          className="pedido-details-button"
                          onClick={() => abrirDetalles(pedido)}
                        >
                          Ver detalles
                        </button>
                        {normalizarEstado(pedido.estado) === "pendiente" && (
                          <button className="pedido-cancel-button">
                            Cancelar pedido
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {pedidoSeleccionado && (
          <PedidoDetalleModal
            pedido={pedidoSeleccionado}
            onClose={cerrarDetalles}
          />
        )}
      </main>
    </div>
  );
}

export default MisPedidos;
