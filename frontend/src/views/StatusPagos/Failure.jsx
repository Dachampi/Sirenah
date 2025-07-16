import { useNavigate } from "react-router-dom"
import { XCircle, Home, ShoppingCart } from "lucide-react"
import "../../styles/stylesPagos/Failure.css"

function Failure() {
  const navigate = useNavigate()

  const handleRetry = () => {
    navigate("/MenuCliente/Carrito")
  }

  const handleGoHome = () => {
    navigate("/")
  }

  return (
    <div className="failure-page-container">
      <div className="failure-card">
        <div className="failure-header-section">
          <div className="failure-icon-container">
            <XCircle className="failure-icon" />
          </div>
          <h1 className="failure-title">Transacción Fallida</h1>
          <p className="failure-message">
            Lo sentimos, tu pago no pudo ser procesado. Por favor, verifica tus datos e intenta nuevamente.
          </p>
        </div>

        <div className="failure-actions">
          <button className="failure-button failure-button-primary" onClick={handleRetry}>
            <ShoppingCart size={20} />
            Intentar de Nuevo
          </button>
          <button className="failure-button failure-button-secondary" onClick={handleGoHome}>
            <Home size={20} />
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  )
}

export default Failure
