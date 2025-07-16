import { useEffect, useState } from "react";
import "../../styles/MiniProfileUser.css"; 
import { obtenerDatos } from "../../services/perfil"; 
import Loading from "../common/Loanding.jsx"; 

function MiniProfileUser() {
  const [datosCliente, setDatosCliente] = useState(null); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 
  useEffect(() => {
    const fetchDatosCliente = async () => {
      try {
        const response = await obtenerDatos();         setDatosCliente(response);
      } catch (error) {
        console.error("Error al obtener los datos del cliente:", error);
        setError("Error al cargar los datos del cliente.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatosCliente();
  }, []);

    if (isLoading) {
    return <Loading message="Cargando datos, por favor espera..." />;
  }

    if (error) {
    return <div className="error-message">{error}</div>;
  }

    if (!datosCliente) {
    return <div className="error-message">No se encontraron datos del cliente.</div>;
  }

    return (
    <div className="mini-profile-user">
      <div className="profile-avatar-user">
        <span>{datosCliente.nombre.charAt(0)}</span>
      </div>
      <div className="profile-info-user">
        <p className="profile-name-user">{datosCliente.nombre}</p>
        <p className="profile-email-user">{datosCliente.role}</p>
        <p className="profile-email-user">{datosCliente.email}</p>
      </div>
    </div>
  );
}

export default MiniProfileUser;
