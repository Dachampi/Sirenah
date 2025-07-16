import { useNavigate } from "react-router-dom"
import { Clock, Home, ShoppingBag } from "lucide-react"
import "../../styles/stylesPagos/Pending.css"

function Pending() {
  const navigate = useNavigate()

  const handleCheckStatus = () => {
    navigate("/MenuCliente/MisCompras") 
  }

  const handleGoHome = () => {
    navigate("/")
  }

  return (
    <div className="pending-page-container">
      <div className="pending-card">
        <div className="pending-header-section">
          <div className="pending-icon-container">
            <Clock className="pending-icon" />
          </div>
          <h1 className="pending-title">Transacción en Proceso</h1>
          <p className="pending-message">
            Tu pago está siendo procesado. Esto puede tardar unos minutos. Por favor, revisa el estado en la sección de
            Mis Compras.
          </p>
        </div>

        <div className="pending-actions">
          <button className="pending-button pending-button-primary" onClick={handleCheckStatus}>
            <ShoppingBag size={20} />
            Ver Mis Compras
          </button>
          <button className="pending-button pending-button-secondary" onClick={handleGoHome}>
            <Home size={20} />
            Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  )
}

export default Pending
