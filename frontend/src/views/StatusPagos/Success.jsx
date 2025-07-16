import { useEffect, useState } from "react"
import { CheckCircle, Home, ShoppingBag, CreditCard, User, DollarSign, Info, Banknote, ReceiptText } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios" // Importar axios
import Loading from "../../components/common/Loanding.jsx"
import "../../styles/stylesUser/SuccessPage.css"

import {
  CheckCircle,
  Home,
  ShoppingBag,
  CreditCard,
  User,
  DollarSign,
  Info,
  Banknote,
  ReceiptText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/common/Loanding.jsx";
import "../../styles/stylesPagos/Success.css";


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
    case "tarjeta_debito":
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

const getTipoIcon = (tipo) => {
  switch (tipo?.toLowerCase()) {
    case "credit_card":
      return <CreditCard />
    case "account_money":
      return <DollarSign />
    case "transferencia":
      return <Banknote />
    case "pago_efectivo":
      return <ReceiptText />
    case "tarjeta_debito":
      return <CreditCard />
    case "deposito_pago_efectivo":
      return <Banknote />
    default:
      return <Info />
  }
}

function Success() {
  const navigate = useNavigate()
  const [idPago, setIdPago] = useState(null)
  const [paymentDetails, setPaymentDetails] = useState(null)
  const [clientDetails, setClientDetails] = useState(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const storedIdPago = localStorage.getItem("idPago")
    if (storedIdPago) {
      setIdPago(storedIdPago)

    } else {
      setError("No se encontró un ID de pago. Por favor, intente de nuevo.")
      setIsLoadingDetails(false)
    }
  }, [])

  useEffect(() => {
    const fetchPaymentAndClientDetails = async () => {
      if (!idPago) return

      setIsLoadingDetails(true)
      setError(null)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Token de autenticación no disponible.")
        }

        // 1. Obtener detalles del pago
        const paymentResponse = await axios.get(
          `${import.meta.env.VITE_API}/todosroles/MercadoPago/ObtenerPorId/${idPago}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        setPaymentDetails(paymentResponse.data)

        const idCliente = paymentResponse.data.pedido.idCliente;
        const clientResponse = await axios.get(
          `${import.meta.env.VITE_API}/todosroles/datosPorId/${idCliente}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setClientDetails(clientResponse.data);

        localStorage.removeItem("idPago");
      } catch (err) {
        console.error("Error al cargar detalles de pago o cliente:", err)
        setError("No se pudieron cargar los detalles de la compra. Intente más tarde.")
      } finally {
        setIsLoadingDetails(false)
      }
    }

    fetchPaymentAndClientDetails()
  }, [idPago])

  const handleGoHome = () => {
    navigate("/")
  }

  const handleViewPurchases = () => {
    navigate("/mis-compras")
  }

  return (
    <div className="success-page-container">
      <div className="success-card">
        <div className="success-header-section">
          <div className="success-icon-container">
            <CheckCircle className="success-icon" />
          </div>
          <h1 className="success-title">¡Pago Exitoso!</h1>
          <p className="success-message">
            Tu transacción se ha completado con éxito. ¡Gracias por tu compra! Recibirás una confirmación por correo
            electrónico en breve.
          </p>
        </div>

        {isLoadingDetails ? (
          <div className="success-loading-container">
            <Loading message="Cargando detalles de la compra..." />
          </div>
        ) : error ? (
          <div className="success-loading-container">
            <p className="success-message" style={{ color: "var(--success-danger-color)" }}>
              {error}
            </p>
          </div>
        ) : (
          <div className="success-details-grid">
            {/* Resumen del Pago */}
            <div className="success-info-card">
              <h3 className="success-subtitle">
                {getTipoIcon(paymentDetails?.tipo)}
                Resumen del Pago
              </h3>
              <div className="success-info-item">
                <span className="success-info-label">ID Transacción:</span>
                <span className="success-info-value">{paymentDetails?.idTransaccion || "N/A"}</span>
              </div>
              <div className="success-info-item">
                <span className="success-info-label">Tipo de Pago:</span>
                <span className="success-info-value">{mapPaymentType(paymentDetails?.tipo)}</span>
              </div>
              <div className="success-info-item">
                <span className="success-info-label">Fecha de Pago:</span>
                <span className="success-info-value">
                  {paymentDetails?.fechaPago
                    ? new Date(paymentDetails.fechaPago).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "N/A"}
                </span>
              </div>
              <div className="success-info-item">
                <span className="success-info-label">Estado:</span>
                <span className="success-info-value">{traducirEstadoDisplay(paymentDetails?.estado)}</span>
              </div>
              <div className="success-info-item success-total-amount">
                <span className="success-info-label">Total:</span>
                <span className="success-info-value">
                  {paymentDetails?.total?.toFixed(2) || "0.00"} {paymentDetails?.moneda || "S/."}
                </span>
              </div>
            </div>

            {/* Datos del Cliente */}
            <div className="success-info-card">
              <h3 className="success-subtitle">
                <User />
                Datos del Cliente
              </h3>
              <div className="success-info-item">
                <span className="success-info-label">Nombre:</span>
                <span className="success-info-value">
                  {clientDetails?.nombre || "N/A"} {clientDetails?.apellido || ""}
                </span>
              </div>
              <div className="success-info-item">
                <span className="success-info-label">Email:</span>
                <span className="success-info-value">{clientDetails?.email || "N/A"}</span>
              </div>
              <div className="success-info-item">
                <span className="success-info-label">Teléfono:</span>
                <span className="success-info-value">{clientDetails?.telefono || "N/A"}</span>
              </div>
              <div className="success-info-item">
                <span className="success-info-label">DNI:</span>
                <span className="success-info-value">{clientDetails?.dni || "N/A"}</span>
              </div>
            </div>
          </div>
        )}

        <div className="success-actions">
          <button className="success-button success-button-primary" onClick={handleViewPurchases}>
            <ShoppingBag size={20} />
            Ver Mis Compras
          </button>
          <button className="success-button success-button-secondary" onClick={handleGoHome}>
            <Home size={20} />
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  )
}

export default Success