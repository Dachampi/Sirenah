import { useState } from "react";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaShoppingBag,
  FaHeart,
  FaUser,
  FaShoppingCart,
  FaMapMarkerAlt,
  FaHeadset,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
import "../../styles/Sidebar.css";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { obtenerDatos } from "../../services/perfil";
import { useEffect } from "react";

function UserSidebar({ onCollapseChange }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const response = await obtenerDatos();
        setUserRole(response.role);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchDatos();
  }, []);
  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const newState = !prev;
      if (onCollapseChange) {
        onCollapseChange(newState);
      }
      return newState;
    });
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setButtonsVisible(true);
  };
  const navigate = useNavigate();
  const Logout = () => {
    setLoading(true);
    setButtonsVisible(false);
    localStorage.clear();
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };
  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isCollapsed ? <FaBars color="#fff" /> : <FaTimes color="#fff" />}
      </button>
      <div className="logo">
        <h2>{isCollapsed ? "" : "Sirenah"}</h2>
      </div>
      <nav>
        <ul>
          {userRole === "ADMIN" && (
            <li>
              <a href="/MenuAdmin/Perfil">
                <FaUser /> <span>Perfil Admin</span>
              </a>
            </li>
          )}
          <li>
            <a href="/MenuCliente/MisCompras">
              <FaShoppingBag /> <span>Mis Compras</span>
            </a>
          </li>
          <li>
            <a href="/MenuCliente/MisPedidos">
              <FaClipboardList /> <span>Mis Pedidos</span>
            </a>
          </li>
          <li>
            <a href="/MenuCliente/ListaDeseos">
              <FaHeart /> <span>Lista de Deseos</span>
            </a>
          </li>
          <li>
            <a href="/MenuCliente/Carrito">
              <FaShoppingCart /> <span>Carrito de Compras</span>
            </a>
          </li>
          <li>
            <a href="/MenuCliente/Direcciones">
              <FaMapMarkerAlt /> <span>Direcciones Guardadas</span>
            </a>
          </li>
          <li>
            <a href="/MenuCliente/Ayuda">
              <FaHeadset /> <span>Soporte y Ayuda</span>
            </a>
          </li>
          <li className="separator"></li>
          <li>
            <a href="/">
              <FaHome /> <span>Inicio</span>
            </a>
          </li>
          <li>
            <a href="/MenuCliente/Perfil">
              <FaUser /> <span>Perfil</span>
            </a>
          </li>

          <li>
            <a style={{ cursor: "pointer" }} onClick={openModal}>
              <FaSignOutAlt /> <span>Cerrar Sesión</span>
            </a>
          </li>
        </ul>
      </nav>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
        aria-label="Confirmar Cierre de Sesión"
      >
        <h2>Confirmar Cierre de Sesión</h2>
        <p>¿Estás seguro de que deseas cerrar sesión?</p>
        <div className="modal-actions">
          {buttonsVisible && (
            <>
              <button onClick={closeModal} className="cancel-button">
                Cancelar
              </button>
              <button onClick={Logout} className="confirm-button">
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
        {loading && (
          <div className="loading">
            <div className="loader"></div>
            Cerrando sesión...
          </div>
        )}
      </Modal>
    </div>
  );
}
UserSidebar.propTypes = {
  onCollapseChange: PropTypes.func.isRequired,
};
export default UserSidebar;
