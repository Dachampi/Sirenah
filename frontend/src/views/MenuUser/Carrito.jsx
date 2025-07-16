import { useEffect, useState } from "react"
import UserSidebar from "../../components/layout/UserSidebar"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import Loading from "../../components/common/Loanding.jsx"
import { vaciarCarrito } from "../../services/CarritoService/VaciarCarrito.js"
import MiniProfileUser from "../../components/common/MiniProfileUser.jsx"
import { useNavigate } from "react-router-dom"
import MercadoPagoWallet from "../../components/layout/mercado-pago/MercadoPagoWallet/index.jsx"

import "../../styles/Carrito.css"

import { ShoppingCart, Trash2, Package, Banknote, MinusCircle, PlusCircle } from "lucide-react"

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

function Carrito() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [usuarioId, setUsuarioId] = useState(null)
  const [isLoading, setIsLoading] = useState(false) 
  const [isUpdating, setIsUpdating] = useState(false) 
  const [showMPButton, setShowMPButton] = useState(false)
  const [showAlertDialog, setShowAlertDialog] = useState(false) 
  const navigate = useNavigate()
  const [cartData, setCartData] = useState(null)

  const handleCollapseChange = (collapsed) => {
    setIsCollapsed(collapsed)
  }

  const obtenerUsuarioId = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.error("No hay token de autenticación disponible.")
        return null
      }
      const decodedToken = jwtDecode(token)
      const email = decodedToken.sub
      const response = await axios.get(`${import.meta.env.VITE_API}/todosroles/datos/${email}`)
      setUsuarioId(response.data.id)
      return response.data.id
    } catch (error) {
      console.error("Error al obtener el ID de usuario:", error)
      return null
    }
  }

  const fetchCartItems = async (idUsuario) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/todosroles/carrito/obtener/${idUsuario}`)
      const carritoData = response.data
      const detallesCarrito = carritoData.detalles || []

      const productosConDetalles = await Promise.all(
        detallesCarrito.map(async (item) => {
          try {
            const productoResponse = await axios.get(
              `${import.meta.env.VITE_API}/todosroles/Productos/Buscar/${item.idProducto}`,
            )
            const productoData = productoResponse.data
            return {
              ...item,
              nombre: productoData.nombre,
              imageUrl: productoData.imgUrl,
            }
          } catch (error) {
            console.error(`Error al obtener detalles del producto ${item.idProducto}:`, error)
            return item 
          }
        }),
      )
      setCartItems(productosConDetalles)
    } catch (error) {
      console.error("Error al obtener el carrito:", error)
      setCartItems([])
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (idCarritoDetalle, newQuantity) => {
    if (newQuantity < 1) return 

    setIsUpdating(true)
    try {
      await axios.put(`${import.meta.env.VITE_API}/todosroles/carrito/actualizarCantidad/${idCarritoDetalle}`, {
        cantidad: newQuantity,
      })
      
      await fetchCartItems(usuarioId)
    } catch (error) {
      console.error("Error al actualizar la cantidad:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const removeItem = async (idCarritoDetalle) => {
    setIsUpdating(true)
    try {
      await axios.delete(`${import.meta.env.VITE_API}/todosroles/carrito/eliminar/${idCarritoDetalle}`)
      // Re-fetch cart items to update the UI
      await fetchCartItems(usuarioId)
    } catch (error) {
      console.error("Error al eliminar el producto:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCheckout = async () => {
    try {
      const data = {
        idUsuario: usuarioId,
        direccion: "Ica",
        detalles: cartItems.map((item) => ({
          idProducto: item.idProducto,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          nombreProducto: item.nombre,
          subtotal: item.subtotal,
        })),
      }
      setCartData(data)
      setShowMPButton(true)
    } catch (error) {
      console.error("Error al preparar la orden:", error)
    }
  }

  const handleClearCart = async () => {
    setShowAlertDialog(false)
    await vaciarCarrito(setIsUpdating, setCartItems)
    setCartItems([])
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.subtotal, 0).toFixed(2)
  }

  useEffect(() => {
    obtenerUsuarioId()
  }, [])

  useEffect(() => {
    if (usuarioId) {
      fetchCartItems(usuarioId)
    }
  }, [usuarioId])

  useEffect(() => {
    const handleMPEvents = (event) => {
      if (event.origin.includes("mercadopago")) {
        console.log("🎯 Evento recibido:", event)
        const data = event.data
        if (data.type === "wallet_payment_result") {
          const status = data.payload?.status
          const paymentId = data.payload?.id
          console.log("✅ Resultado del pago:", data.payload)
          if (status === "approved") {
            localStorage.setItem("idPago", paymentId)
            navigate("/PagoExitoso")
          } else if (status === "pending") {
            navigate("/PagoPendiente")
          } else {
            navigate("/PagoFallido")
          }
        }
      }
    }
    window.addEventListener("message", handleMPEvents)
    return () => window.removeEventListener("message", handleMPEvents)
  }, [navigate])

  return (
    <div className="carrito-user-layout">
      <UserSidebar onCollapseChange={handleCollapseChange} />
      <main className={`carrito-content ${isCollapsed ? "collapsed" : ""}`}>
        <div className="carrito-profile-container">
          <MiniProfileUser />
        </div>

        {isLoading || isUpdating ? (
          <div className="carrito-loading-container-full">
            <Loading message={isLoading ? "Cargando carrito..." : "Actualizando carrito..."} />
          </div>
        ) : (
          <div className="carrito-card">
            <div className="carrito-header">
              <h1 className="carrito-title">
                <ShoppingCart className="carrito-title-icon" />
                Tu Carrito
              </h1>
            </div>
            <div className="carrito-content-area">
              {cartItems.length > 0 ? (
                <div className="carrito-product-list">
                  {cartItems.map((item) => (
                    <div key={item.idCarritoDetalle} className="carrito-product-item">
                      <img
                        src={item.imageUrl || "/placeholder.svg?height=96&width=96"}
                        alt={item.nombre}
                        className="carrito-product-image"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=96&width=96"
                        }}
                      />
                      <div className="carrito-product-details">
                        <h3 className="carrito-product-name">{item.nombre}</h3>
                        <p className="carrito-product-price-unit">
                          Precio Unitario: S/. {item.precioUnitario.toFixed(2)}
                        </p>
                      </div>
                      <div className="carrito-quantity-controls">
                        <button
                          className="carrito-quantity-button"
                          onClick={() => updateQuantity(item.idCarritoDetalle, item.cantidad - 1)}
                          disabled={item.cantidad <= 1 || isUpdating}
                        >
                          <MinusCircle className="carrito-quantity-button-icon" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.cantidad}
                          onChange={(e) => updateQuantity(item.idCarritoDetalle, Number.parseInt(e.target.value))}
                          className="carrito-quantity-input"
                          disabled={isUpdating}
                        />
                        <button
                          className="carrito-quantity-button"
                          onClick={() => updateQuantity(item.idCarritoDetalle, item.cantidad + 1)}
                          disabled={isUpdating}
                        >
                          <PlusCircle className="carrito-quantity-button-icon" />
                        </button>
                      </div>
                      <span className="carrito-item-subtotal">S/. {item.subtotal.toFixed(2)}</span>
                      <button
                        className="carrito-remove-button"
                        onClick={() => removeItem(item.idCarritoDetalle)}
                        disabled={isUpdating}
                      >
                        <Trash2 className="carrito-quantity-button-icon" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="carrito-empty-cart-state">
                  <Package className="carrito-empty-cart-icon" />
                  <h3 className="carrito-empty-cart-title">Tu carrito está vacío</h3>
                  <p className="carrito-empty-cart-description">Agrega algunos productos para empezar a comprar.</p>
                </div>
              )}
            </div>
            {cartItems.length > 0 && (
              <div className="carrito-footer">
                <div className="carrito-total-display">
                  <span>Total:</span>
                  <span>S/. {calculateTotal()}</span>
                </div>
                <div className="carrito-action-buttons">
                  <button
                    className="carrito-btn-clear-cart"
                    onClick={() => setShowAlertDialog(true)} // Abre el diálogo de confirmación
                    disabled={isUpdating}
                  >
                    <Trash2 className="carrito-quantity-button-icon" />
                    Vaciar Carrito
                  </button>
                  <button className="carrito-btn-checkout" onClick={handleCheckout} disabled={isUpdating}>
                    <Banknote className="carrito-quantity-button-icon" />
                    Realizar Compra
                  </button>
                </div>
                {showMPButton && cartData && (
                  <div className="carrito-mp-wallet-container">
                    <MercadoPagoWallet triggerPayment={showMPButton} cartData={cartData} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Custom Alert Dialog for "Vaciar Carrito" */}
        {showAlertDialog && (
          <div className="carrito-custom-alert-overlay" onClick={() => setShowAlertDialog(false)}>
            <div className="carrito-custom-alert-content" onClick={(e) => e.stopPropagation()}>
              <div className="carrito-custom-alert-header">
                <h2 className="carrito-custom-alert-title">¿Estás absolutamente seguro?</h2>
                <p className="carrito-custom-alert-description">
                  Esta acción eliminará todos los productos de tu carrito. No podrás deshacer esta acción.
                </p>
              </div>
              <div className="carrito-custom-alert-footer">
                <button className="carrito-custom-alert-cancel-btn" onClick={() => setShowAlertDialog(false)}>
                  Cancelar
                </button>
                <button className="carrito-custom-alert-action-btn" onClick={handleClearCart}>
                  Vaciar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Carrito
