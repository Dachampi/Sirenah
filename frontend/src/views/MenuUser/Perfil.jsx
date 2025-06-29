import UserSidebar from "../../components/layout/UserSidebar"
import { useEffect, useState } from 'react';
import '../../styles/stylesAdm/APerfil.css';
import { obtenerDatos } from "../../services/perfil";
import { AlertaDeError } from "../../utils/Alertas";


function Perfil() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [user, setUser] = useState(null);
    useEffect(() => {
        fetchUserData();
    }, []);
    const fetchUserData = async () => {
        try {
            const data = await obtenerDatos();
            setUser(data);
        } catch (error) {
            console.error(error);
            AlertaDeError('Error', 'Error al listar usuarios');
        }
    };
    
    
    const handleCollapseChange = (collapsed) => {
        setIsCollapsed(collapsed);
    };


    return (
        <div className="user-layout">
            <UserSidebar onCollapseChange={handleCollapseChange} />
            <main className={`profile-content ${isCollapsed ? 'collapsed' : ''}`}>
                <div className="welcome-section">
                    <h1>Bienvenido de nuevo</h1>
                    <p className="subtitle">Panel de Control Personal</p>
                </div>

                <div className="profile-grid">
                    {user ? (
                        <>
                            <div className="profile-card main-info">
                                <div className="profile-header">
                                    <div className="profile-avatar">
                                        {user.nombre.charAt(0)}
                                    </div>
                                    <div className="profile-title">
                                        <h2>{user.nombre} {user.apellido}</h2>
                                        <span className="role-badge">{user.role}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-card contact-info">
                                <h3>Información de Contacto</h3>
                                <div className="info-item">
                                    <span className="info-label">Email</span>
                                    <span className="info-value">{user.email}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Teléfono</span>
                                    <span className="info-value">{user.telefono}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">DNI</span>
                                    <span className="info-value">{user.dni}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Fecha de Nacimiento</span>
                                    <span className="info-value">{user.fecha_nacimiento}</span>
                                </div>
                            </div>

                            <div className="profile-card quick-actions">
                                <h3>Acciones Rápidas</h3>
                                <div className="action-buttons">
                                    <button className="action-btn">Cambiar Contraseña</button>
                                    <button className="action-btn">Configurar Notificaciones</button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="loading-message">Cargando datos del usuario...</div>
                    )}
                    
                </div>
            </main>
        </div>
    );
}

export default Perfil;
