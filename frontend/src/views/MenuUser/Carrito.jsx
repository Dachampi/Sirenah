import { useEffect, useState } from "react";
import UserSidebar from "../../components/layout/UserSidebar";
import "../../styles/stylesUser/CarritoPanel.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
const token = localStorage.getItem("token");
import Loading from "../../components/common/Loanding.jsx";
import { vaciarCarrito } from "../../services/CarritoService/VaciarCarrito.js";
import MiniProfileUser from "../../components/common/MiniProfileUser.jsx";
import { useNavigate } from "react-router-dom";
import MercadoPagoWallet from "../../components/layout/mercado-pago/MercadoPagoWallet/index.jsx";

axios.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function Carrito() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [usuarioId, setUsuarioId] = useState(null);
  const handleCollapseChange = (collapsed) => {
    setIsCollapsed(collapsed);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [showMPButton, setShowMPButton] = useState(false);
  const navigate = useNavigate();
  const [cartData, setCartData] = useState(null);

  const [pedidoId, setPedidoId] = useState(null);

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
      };

      setCartData(data);
      setShowMPButton(true);
    } catch (error) {
      console.error("Error al preparar la orden:", error);
    }
  };

  const obtenerUsuarioId = async () => {
    try {
      const decodedToken = jwtDecode(localStorage.getItem("token"));
      const email = decodedToken.sub;
      const response = await axios.get(
        `${import.meta.env.VITE_API}/todosroles/datos/${email}`
      );
      setUsuarioId(response.data.id);
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
    }
  };

  const fetchCartItems = async (idUsuario) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API}/todosroles/carrito/obtener/${idUsuario}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error al obtener el carrito");
      }
      const carritoData = await response.json();

      const detallesCarrito = carritoData.detalles || [];
      const productosConDetalles = await Promise.all(
        detallesCarrito.map(async (item) => {
          try {
            const productoResponse = await fetch(
              `${import.meta.env.VITE_API}/todosroles/Productos/Buscar/${
                item.idProducto
              }`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!productoResponse.ok) {
              throw new Error(`Error al obtener producto ${item.idProducto}`);
            }

            const productoData = await productoResponse.json();

            return {
              ...item,
              nombre: productoData.nombre,
              imageUrl: productoData.imgUrl,
            };
          } catch (error) {
            console.error(
              `Error al obtener detalles del producto ${item.idProducto}:`,
              error
            );
            return item;
          }
        })
      );
      setCartItems(productosConDetalles);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    obtenerUsuarioId();
  }, []);

  useEffect(() => {
    if (usuarioId) {
      fetchCartItems(usuarioId);
    }
  }, [usuarioId]);

  useEffect(() => {
  const handleMPEvents = (event) => {
    if (event.origin.includes("mercadopago")) {
      console.log("🎯 Evento recibido:", event);
      const data = event.data;

      if (data.type === "wallet_payment_result") {
        const status = data.payload?.status;
        const paymentId = data.payload?.id;

        console.log("✅ Resultado del pago:", data.payload);

        if (status === "approved") {
          localStorage.setItem("idPago", paymentId);
          navigate("/PagoExitoso");
        } else if (status === "pending") {
          navigate("/PagoPendiente");
        } else {
          navigate("/PagoFallido");
        }
      }
    }
  };

  window.addEventListener("message", handleMPEvents);
  return () => window.removeEventListener("message", handleMPEvents);
}, [navigate]);


  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.subtotal, 0)
      .toFixed(2);
  };

  return (
    <div className="user-layout">
      {isLoading && <Loading message="Cargando datos, por favor espera..." />}
      {isLoading1 && <Loading message="Eliminando productos del carrito." />}

      <UserSidebar onCollapseChange={handleCollapseChange} />
      <main
        style={{ marginTop: "0px" }}
        className={`content ${isCollapsed ? "collapsed" : ""}`}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "10px 20px",
          }}
        >
          <MiniProfileUser />
        </div>
        <div className="cart-content">
          <h1>Tu Carrito</h1>
          {cartItems.length > 0 ? (
            <>
              <ul className="cart-items">
                {cartItems.map((item) => (
                  <li key={item.idCarritoDetalle} className="cart-item">
                    <div className="item-info">
                      <img
                        src={item.imageUrl}
                        alt={`Producto ${item.idProducto}`}
                        className="item-image"
                      />
                      <div className="item-details">
                        <h4>{item.nombre}</h4>
                        <p>Cantidad: {item.cantidad}</p>
                        <p>
                          Precio unitario: S/. {item.precioUnitario.toFixed(2)}
                        </p>
                        <p>Subtotal: S/. {item.subtotal.toFixed(2)}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-summary">
                <h3>Total: ${calculateTotal()}</h3>
                <div className="cart-actions">
                  <button
                    className="btn-clear"
                    onClick={() => vaciarCarrito(setIsLoading1, setCartItems)}
                  >
                    Vaciar Carrito
                  </button>
                  <button className="btn-checkout" onClick={handleCheckout}>
                    Realizar Compra
                  </button>

                  {showMPButton && cartData && (
                    <MercadoPagoWallet
                      triggerPayment={showMPButton}
                      cartData={cartData}
                    />
                  )}
                </div>
              </div>
            </>
          ) : (
            <p>Tu carrito está vacío.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Carrito;
