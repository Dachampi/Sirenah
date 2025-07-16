import PropTypes from "prop-types"
import { X } from "lucide-react"
import "../../styles/stylesAdm/AVentaDetalleModal.css"

const mapPaymentType = (type) => {
  switch (type?.toLowerCase()) {
    case "credit_card":
      return "Tarjeta de Crédito"
    case "account_money":
      return "Dinero en Cuenta (Mercado Pago)"
    case "transferencia":
      return "Transferencia Bancaria"
    case "pago_efectivo":
      return "Pago en Efectivo"
    case "debit_card":
      return "Tarjeta de Débito"
    case "deposito_pago_efectivo":
      return "Depósito Pago Efectivo"
    default:
      return type ? type.replace(/_/g, " ") : "N/A"
  }
}

const traducirEstadoDisplay = (estado) => {
  switch (estado?.toLowerCase()) {
    case "approved":
      return "Aprobado"
    case "pending":
      return "Pendiente"
    case "rejected":
      return "Rechazado"
    case "in_process":
      return "En Proceso"
    case "cancelled":
      return "Cancelado"
    case "refunded":
      return "Reembolsado"
    default:
      return estado || "Desconocido"
  }
}

const getEstadoClass = (estado) => {
  switch (estado?.toLowerCase()) {
    case "approved":
      return "ventas-container-status-approved"
    case "pending":
      return "ventas-container-status-pending"
    case "rejected":
      return "ventas-container-status-rejected"
    case "in_process":
      return "ventas-container-status-in_process"
    case "cancelled":
      return "ventas-container-status-cancelled"
    case "refunded":
      return "ventas-container-status-refunded"
    default:
      return "ventas-container-status-default"
  }
}

export function VentaDetalleModal({ isOpen, onClose, venta }) {
  if (!isOpen || !venta) return null

  const IGV_RATE = 0.18   const subtotalSinIGV = venta.total / (1 + IGV_RATE)
  const igvMonto = venta.total - subtotalSinIGV

  return (
    <div className={`ventas-modal-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div className="ventas-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="ventas-modal-header">
          <h2 className="ventas-modal-title">Detalles de la Venta #{venta.idPago}</h2>
          <p className="ventas-modal-description">Información completa sobre la transacción y el pedido.</p>
          <button className="ventas-modal-close-btn" onClick={onClose} aria-label="Cerrar">
            <X size={24} />
          </button>
        </div>

        <div className="ventas-modal-separator"></div>

        {/* Sección de Información General */}
        <div className="ventas-modal-section">
          <h3 className="ventas-modal-section-title">Información General</h3>
          <p>
            <strong>ID Transacción:</strong> {venta.idTransaccion}
          </p>
          <p>
            <strong>Fecha de Pago:</strong> {new Date(venta.fechaPago).toLocaleString("es-ES")}
          </p>
          <p>
            <strong>Tipo de Pago:</strong> {mapPaymentType(venta.tipo)}
          </p>
          <p>
            <strong>Estado:</strong>{" "}
            <span className={`ventas-modal-status-badge ${getEstadoClass(venta.estado)}`}>
              {traducirEstadoDisplay(venta.estado)}
            </span>
          </p>
        </div>

        <div className="ventas-modal-separator"></div>

        {/* Sección de Datos del Cliente */}
        <div className="ventas-modal-section">
          <h3 className="ventas-modal-section-title">Datos del Cliente</h3>
          <p>
            <strong>Nombre:</strong> {venta.cliente?.nombre} {venta.cliente?.apellido}
          </p>
          <p>
            <strong>DNI:</strong> {venta.cliente?.dni || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {venta.cliente?.email || "N/A"}
          </p>
          <p>
            <strong>Teléfono:</strong> {venta.cliente?.telefono || "N/A"}
          </p>
          <p>
            <strong>Dirección de Entrega:</strong> {venta.pedido?.direccion || "N/A"}
          </p>
        </div>

        <div className="ventas-modal-separator"></div>

        {/* Sección de Productos */}
        <div className="ventas-modal-section">
          <h3 className="ventas-modal-section-title">Productos del Pedido</h3>
          <ul className="ventas-modal-product-list">
            {venta.pedido?.detalles?.map((item, index) => (
              <li key={index} className="ventas-modal-product-item">
                <span>
                  {item.cantidad} x {item.nombreProducto}
                </span>
                <span>
                  {venta.moneda} {item.subtotal.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ventas-modal-separator"></div>

        {/* Sección de Totales */}
        <div className="ventas-modal-section" style={{ alignSelf: "flex-end", textAlign: "right" }}>
          <p>
            <strong>Subtotal:</strong> {venta.moneda} {subtotalSinIGV.toFixed(2)}
          </p>
          <p>
            <strong>IGV (18%):</strong> {venta.moneda} {igvMonto.toFixed(2)}
          </p>
          <p className="total-amount">
            <strong>TOTAL:</strong> {venta.moneda} {venta.total.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}

VentaDetalleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  venta: PropTypes.shape({
    idPago: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    idTransaccion: PropTypes.string,
    fechaPago: PropTypes.string,
    tipo: PropTypes.string,
    estado: PropTypes.string,
    moneda: PropTypes.string,
    total: PropTypes.number,
    cliente: PropTypes.shape({
      nombre: PropTypes.string,
      apellido: PropTypes.string,
      dni: PropTypes.string,
      email: PropTypes.string,
      telefono: PropTypes.string,
    }),
    pedido: PropTypes.shape({
      direccion: PropTypes.string,
      detalles: PropTypes.arrayOf(
        PropTypes.shape({
          cantidad: PropTypes.number,
          nombreProducto: PropTypes.string,
          subtotal: PropTypes.number,
        })
      ),
    }),
  }),
}
