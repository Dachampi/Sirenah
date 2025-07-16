import PropTypes from "prop-types"
import { useState, useEffect } from "react"
import { XCircle, CreditCard, Package, User, DollarSign, Info, Banknote, ReceiptText } from "lucide-react" 
const mapPaymentType = (type) => {
  switch (type.toLowerCase()) {
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
      return type.replace(/_/g, " ")
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
      return estado 
  }
}

const useProductoInfo = (idProducto) => {
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!idProducto) return

    const fetchProducto = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${import.meta.env.VITE_API}/public/Productos/Buscar/${idProducto}`)
        if (response.ok) {
          const data = await response.json()
          setProducto(data)
        }
      } catch (error) {
        console.error("Error al obtener producto:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducto()
  }, [idProducto])

  return { producto, loading }
}


const ProductoItem = ({ detalle }) => {
  const { producto, loading } = useProductoInfo(detalle.idProducto)

  return (
    <div className="pedido-modal-producto-item">
      <div className="pedido-modal-producto-imagen">
        {loading ? (
          <div className="pedido-producto-imagen-loading">
            <Package size={24} />
          </div>
        ) : (
          <img
            src={producto?.imgUrl || "/placeholder.svg?height=60&width=60"}
            alt={producto?.nombre || detalle.nombreProducto || "Producto"}
            className="pedido-producto-imagen"
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=60&width=60"
            }}
          />
        )}
      </div>
      <div className="pedido-modal-producto-info">
        <h4 className="pedido-modal-producto-nombre">
          {producto?.nombre || detalle.nombreProducto || "Producto"}
        </h4>
        <p className="pedido-modal-producto-precio">S/. {detalle.precioUnitario.toFixed(2)} c/u</p>
        {producto?.descripcion && (
          <p className="pedido-modal-producto-descripcion">{producto.descripcion}</p>
        )}
      </div>
      <div className="pedido-modal-producto-cantidad">
        <span className="pedido-modal-cantidad-label">Cantidad:</span>
        <span className="pedido-modal-cantidad-value">{detalle.cantidad}</span>
      </div>
      <div className="pedido-modal-producto-subtotal">
        <span className="pedido-modal-subtotal-label">Subtotal:</span>
        <span className="pedido-modal-subtotal-value">S/. {detalle.subtotal.toFixed(2)}</span>
      </div>
    </div>
  )
}

const CompraDetalleModal = ({ pago, onClose }) => {
  const [clienteDatos, setClienteDatos] = useState(null)
  const [isLoadingCliente, setIsLoadingCliente] = useState(true)

  useEffect(() => {
    if (!pago) return

    const fetchClienteDatos = async () => {
      setIsLoadingCliente(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`${import.meta.env.VITE_API}/todosroles/datosPorId/${pago.pedido.idCliente}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
        if (!response.ok) throw new Error("Error al obtener datos del cliente")
        const data = await response.json()
        setClienteDatos(data)
      } catch (error) {
        console.error("Error al obtener datos del cliente:", error)
      } finally {
        setIsLoadingCliente(false)
      }
    }
    fetchClienteDatos()
  }, [pago])


  const getTipoIcon = (type) => {
    switch (type.toLowerCase()) {
      case "credit_card":
        return <CreditCard size={16} />
      case "account_money":
        return <DollarSign size={16} />
      case "transferencia":
        return <Banknote size={16} />
      case "pago_efectivo":
        return <ReceiptText size={16} />
      case "debit_card":
        return <CreditCard size={16} />
      case "deposito_pago_efectivo":
        return <Banknote size={16} />
      default:
        return <Info size={16} />
    }
  }

  return (
    <div className="compra-modal-overlay" onClick={onClose}>
      <div className="compra-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="compra-modal-header">
          <h2 className="compra-modal-title">Detalles de la Compra #{pago?.idPago}</h2>
          <button className="compra-modal-close" onClick={onClose}>
            <XCircle size={24} />
          </button>
        </div>

        <div className="compra-modal-body">
          <div className="compra-modal-info-grid">
            <div className="compra-modal-info-card">
              <h3 className="compra-modal-subtitle">
                {/* Usar el icono del tipo de pago aquí */}
                {getTipoIcon(pago?.tipo || "")}
                Información del Pago
              </h3>
              <div className="compra-modal-info-item">
                <span className="compra-modal-label">ID Transacción:</span>
                <span className="compra-modal-value">{pago?.idTransaccion}</span>
              </div>
              <div className="compra-modal-info-item">
                <span className="compra-modal-label">Tipo de Pago:</span>
                <span className="compra-modal-value">{mapPaymentType(pago?.tipo || "")}</span>
              </div>
              <div className="compra-modal-info-item">
                <span className="compra-modal-label">Fecha de Pago:</span>
                <span className="compra-modal-value">
                  {pago?.fechaPago
                    ? new Date(pago.fechaPago).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }) +
                      ", " +
                      new Date(pago.fechaPago).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })
                    : "N/A"}
                </span>
              </div>
              <div className="compra-modal-info-item">
                <span className="compra-modal-label">Estado:</span>
                <span className={`compra-modal-estado ${pago?.estado.toLowerCase()}`}>{traducirEstadoDisplay(pago?.estado)}</span>
              </div>
              <div className="compra-modal-info-item compra-modal-total-amount">
                <span className="compra-modal-label">Total:</span>
                <span className="compra-modal-value">
                  {pago?.total.toFixed(2)} {pago?.moneda}
                </span>
              </div>
            </div>

            <div className="compra-modal-info-card">
              <h3 className="compra-modal-subtitle">
                <User className="compra-modal-subtitle-icon" />
                Datos del Cliente
              </h3>
              {isLoadingCliente ? (
                <p className="compra-loading-text">Cargando datos del cliente...</p>
              ) : clienteDatos ? (
                <>
                  <div className="compra-modal-info-item">
                    <span className="compra-modal-label">Nombre:</span>
                    <span className="compra-modal-value">
                      {clienteDatos.nombre} {clienteDatos.apellido}
                    </span>
                  </div>
                  <div className="compra-modal-info-item">
                    <span className="compra-modal-label">DNI:</span>
                    <span className="compra-modal-value">{clienteDatos.dni}</span>
                  </div>
                  <div className="compra-modal-info-item">
                    <span className="compra-modal-label">Email:</span>
                    <span className="compra-modal-value">{clienteDatos.email}</span>
                  </div>
                  <div className="compra-modal-info-item">
                    <span className="compra-modal-label">Teléfono:</span>
                    <span className="compra-modal-value">{clienteDatos.telefono}</span>
                  </div>
                </>
              ) : (
                <p className="compra-error-text">No se pudieron cargar los datos del cliente.</p>
              )}
            </div>
          </div>

          <div className="compra-modal-productos">
            <h3 className="compra-modal-subtitle">
              <Package className="compra-modal-subtitle-icon" />
              Productos del Pedido ({pago?.pedido?.detalles.length})
            </h3>
            <div className="compra-modal-productos-list">
              {pago?.pedido?.detalles.map((detalle) => (
                <ProductoItem key={detalle.idDetallePedido} detalle={detalle} />
              ))}
            </div>
          </div>
        </div>

        <div className="compra-modal-footer">
          <button className="compra-modal-close-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompraDetalleModal

ProductoItem.propTypes = {
  detalle: PropTypes.shape({
    idProducto: PropTypes.number.isRequired,
    nombreProducto: PropTypes.string.isRequired,
    precioUnitario: PropTypes.number.isRequired,
    cantidad: PropTypes.number.isRequired,
    subtotal: PropTypes.number.isRequired,
  }).isRequired,
}

CompraDetalleModal.propTypes = {
  pago: PropTypes.shape({
    idPago: PropTypes.number.isRequired,
    idTransaccion: PropTypes.string,
    tipo: PropTypes.string,
    fechaPago: PropTypes.string,
    estado: PropTypes.string,
    total: PropTypes.number,
    moneda: PropTypes.string,
    pedido: PropTypes.shape({
      idCliente: PropTypes.number.isRequired,
      detalles: PropTypes.arrayOf(
        PropTypes.shape({
          idDetallePedido: PropTypes.number.isRequired,
          idProducto: PropTypes.number.isRequired,
          nombreProducto: PropTypes.string.isRequired,
          precioUnitario: PropTypes.number.isRequired,
          cantidad: PropTypes.number.isRequired,
          subtotal: PropTypes.number.isRequired,
        }),
      ),
    }),
  }),
  onClose: PropTypes.func.isRequired,
}
