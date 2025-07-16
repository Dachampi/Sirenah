import { useState, useEffect } from "react"
import { Package, Calendar, CreditCard, XCircle } from "lucide-react"
import "../../styles/stylesUser/PedidoDetalleModal.css"
import PropTypes from "prop-types"

const normalizarEstado = (estado) => {
  const estadoLimpio = estado.toLowerCase().trim()
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
  }
  return mapeoEstados[estadoLimpio] || estadoLimpio
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

const PedidoDetalleModal = ({ pedido, onClose }) => {
  if (!pedido) return null

  const total = pedido.detalles.reduce((acc, d) => acc + d.subtotal, 0)

  return (
    <div className="pedido-modal-overlay" onClick={onClose}>
      <div className="pedido-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="pedido-modal-header">
          <h2 className="pedido-modal-title">Detalles del Pedido #{pedido.idPedido}</h2>
          <button className="pedido-modal-close" onClick={onClose}>
            <XCircle size={24} />
          </button>
        </div>

        <div className="pedido-modal-body">
          <div className="pedido-modal-info-grid">
            <div className="pedido-modal-info-card">
              <h3 className="pedido-modal-subtitle">
                <Calendar className="pedido-modal-subtitle-icon" />
                Información del Pedido
              </h3>
              <div className="pedido-modal-info-item">
                <span className="pedido-modal-label">Fecha:</span>
                <span className="pedido-modal-value">
                  {new Date(pedido.fechaPedido).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="pedido-modal-info-item">
                <span className="pedido-modal-label">Estado:</span>
                <span className={`pedido-modal-estado ${normalizarEstado(pedido.estado)}`}>{pedido.estado}</span>
              </div>
              <div className="pedido-modal-info-item">
                <span className="pedido-modal-label">Dirección:</span>
                <span className="pedido-modal-value">{pedido.direccion}</span>
              </div>
            </div>

            <div className="pedido-modal-info-card">
              <h3 className="pedido-modal-subtitle">
                <CreditCard className="pedido-modal-subtitle-icon" />
                Resumen de Costos
              </h3>
              <div className="pedido-modal-info-item">
                <span className="pedido-modal-label">Subtotal:</span>
                <span className="pedido-modal-value">S/. {total.toFixed(2)}</span>
              </div>
              <div className="pedido-modal-info-item">
                <span className="pedido-modal-label">Envío:</span>
                <span className="pedido-modal-value">Gratis</span>
              </div>
              <div className="pedido-modal-info-item pedido-modal-total">
                <span className="pedido-modal-label">Total:</span>
                <span className="pedido-modal-value">S/. {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="pedido-modal-productos">
            <h3 className="pedido-modal-subtitle">
              <Package className="pedido-modal-subtitle-icon" />
              Productos ({pedido.detalles.length})
            </h3>
            <div className="pedido-modal-productos-list">
              {pedido.detalles.map((detalle) => (
                <ProductoItem key={detalle.idDetallePedido} detalle={detalle} />
              ))}
            </div>
          </div>
        </div>

        <div className="pedido-modal-footer">
          {normalizarEstado(pedido.estado) === "pendiente" && (
            <button className="pedido-modal-cancel-btn">
              <XCircle size={16} />
              Cancelar Pedido
            </button>
          )}
          <button className="pedido-modal-close-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default PedidoDetalleModal

ProductoItem.propTypes = {
  detalle: PropTypes.shape({
    idDetallePedido: PropTypes.number.isRequired,
    idProducto: PropTypes.number.isRequired,
    nombreProducto: PropTypes.string.isRequired,
    precioUnitario: PropTypes.number.isRequired,
    cantidad: PropTypes.number.isRequired,
    subtotal: PropTypes.number.isRequired,
  }).isRequired,
}

PedidoDetalleModal.propTypes = {
  pedido: PropTypes.shape({
    idPedido: PropTypes.number.isRequired,
    fechaPedido: PropTypes.string.isRequired,
    estado: PropTypes.string.isRequired,
    direccion: PropTypes.string.isRequired,
    detalles: PropTypes.arrayOf(ProductoItem.propTypes.detalle).isRequired,
  }),
  onClose: PropTypes.func.isRequired,
}
