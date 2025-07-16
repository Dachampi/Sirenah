import AdminSidebar from "../../components/layout/AdminSidebar.jsx";
import { useState, useEffect } from "react";
import "../../styles/stylesAdm/ATablas.css";
import "../../styles/stylesAdm/ListadoEmpleados.css";
import MiniProfile from "../../components/common/MiniProfile.jsx";
import { listarEmpleados } from "../../services/empleadosApi.js";
import { useNavigate } from "react-router-dom";
import {
  AlertaDeEliminacion,
  AlertaDeExito,
  AlertaDeError,
} from "../../utils/Alertas.js";
import { eliminarUsuario } from "../../services/usuariosApi.js";
function Empleados() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [empleados, setEmpleados] = useState([]);
  const [filteredEmpleados, setFilteredEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [empleadoToDelete, setEmpleadoToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCollapseChange = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  const cargarEmpleados = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listarEmpleados();
      setEmpleados(data);
      setFilteredEmpleados(data);
    } catch (err) {
      setError("Error al cargar la lista de empleados");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEmpleados(empleados);
    } else {
      const filtered = empleados.filter((empleado) => {
        const searchLower = searchTerm.toLowerCase();
        const fullName =
          `${empleado.nombre} ${empleado.apellido}`.toLowerCase();
        const dni = empleado.dni?.toLowerCase() || "";
        const email = empleado.email?.toLowerCase() || "";

        return (
          fullName.includes(searchLower) ||
          dni.includes(searchLower) ||
          email.includes(searchLower)
        );
      });
      setFilteredEmpleados(filtered);
    }
  }, [searchTerm, empleados]);

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return "N/A";
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const formatearTelefono = (telefono) => {
    if (!telefono) return "N/A";
    return telefono.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
  };

  const handleDeleteClick = (empleado) => {
    setEmpleadoToDelete(empleado);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const confirmacion = await AlertaDeEliminacion(
        "¿Eliminar eempleado?",
        `¿Estás seguro de eliminar a ${empleadoToDelete.nombre} ${empleadoToDelete.apellido}?`
      );

      if (confirmacion.isConfirmed) {
        await eliminarUsuario({ ourUsers: { id: empleadoToDelete.id } });

        setShowDeleteModal(false);
        setEmpleadoToDelete(null);

        AlertaDeExito(
          "Empleado eliminado",
          "El empleado fue eliminado correctamente."
        );
      }
      cargarEmpleados();
    } catch (error) {
      console.error("Error al eliminar empleado:", error);
      AlertaDeError("Error al eliminar", "No se pudo eliminar el empleado.");
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setEmpleadoToDelete(null);
  };
  const navigate = useNavigate();

  const handleNavigateToUsuarios = () => {
    navigate("/MenuAdmin/Usuarios");
  };

  const handleNavigateToAdministradores = () => {
    navigate("/MenuAdmin/Administradores");
  };

  const handleAddEmpleado = () => {
    navigate("/MenuAdmin/Empleados/Agregar");
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="Empleado-layout">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px 20px",
        }}
      >
        <MiniProfile />
      </div>

      <AdminSidebar onCollapseChange={handleCollapseChange} />

      <main
        style={{ marginTop: "0px" }}
        className={`content ${isCollapsed ? "collapsed" : ""}`}
      >
        <div className="empleado-container">
          <div className="empleado-card">
            {/* Header con navegación */}
            <div className="empleado-header">
              <div className="header-left">
                <h1 className="empleado-title">
                  <span className="title-icon">👷‍♂️</span>
                  Empleados
                </h1>
                <p className="empleado-subtitle">
                  Gestiona el personal y empleados de la empresa
                </p>
              </div>

              <div className="header-right">
                <div className="header-actions">
                  <button
                    className="add-empleado-btn"
                    onClick={handleAddEmpleado}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="22" y1="11" x2="22" y2="17" />
                      <line x1="19" y1="14" x2="25" y2="14" />
                    </svg>
                    Agregar
                  </button>

                  <div className="nav-buttons">
                    <button
                      className="nav-btn users"
                      onClick={handleNavigateToUsuarios}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Ir a Usuarios
                    </button>
                    <button
                      className="nav-btn admins"
                      onClick={handleNavigateToAdministradores}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      Ir a Administradores
                    </button>
                  </div>
                </div>

                {!loading && (
                  <div className="empleado-stats">
                    <div className="stat-item">
                      <span className="stat-number">
                        {filteredEmpleados.length}
                      </span>
                      <span className="stat-label">Mostrados</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">
                        {empleados.filter((empleado) => empleado.estado).length}
                      </span>
                      <span className="stat-label">Activos</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Barra de filtrado */}
            <div className="filter-bar">
              <div className="search-container">
                <div className="search-input-wrapper">
                  <svg
                    className="search-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar por nombre, DNI o email... 🔍"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                  {searchTerm && (
                    <button className="clear-search" onClick={clearSearch}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
                {searchTerm && (
                  <div className="search-results">
                    ✨ {filteredEmpleados.length} resultado
                    {filteredEmpleados.length !== 1 ? "s" : ""} encontrado
                    {filteredEmpleados.length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>

            <div className="empleado-content">
              {loading && (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <span className="loading-text">Cargando empleados... ⏳</span>
                </div>
              )}

              {error && (
                <div className="error-alert">
                  <span className="error-text">❌ {error}</span>
                </div>
              )}

              {!loading &&
                !error &&
                filteredEmpleados.length === 0 &&
                searchTerm && (
                  <div className="empty-state">
                    <div className="empty-icon">🔍</div>
                    <h3>No se encontraron resultados</h3>
                    <p>No hay empleados que coincidan con {searchTerm}</p>
                    <button className="clear-filter-btn" onClick={clearSearch}>
                      Limpiar filtro
                    </button>
                  </div>
                )}

              {!loading && !error && empleados.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">👷‍♂️</div>
                  <h3>No hay empleados</h3>
                  <p>Aún no se han registrado empleados en el sistema</p>
                </div>
              )}

              {!loading && !error && filteredEmpleados.length > 0 && (
                <div className="table-container">
                  <table className="empleado-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>👷‍♂️ Empleado</th>
                        <th>📧 Contacto</th>
                        <th>🏷️ Rol</th>
                        <th>📄 DNI</th>
                        <th>🎂 Edad</th>
                        <th>📊 Estado</th>
                        <th>⚙️ Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmpleados.map((empleado) => (
                        <tr key={empleado.id} className="table-row">
                          <td className="id-cell">
                            <span className="id-text">#{empleado.id}</span>
                          </td>
                          <td className="empleado-cell">
                            <div className="empleado-info">
                              <div className="empleado-avatar">
                                {empleado.nombre?.charAt(0)}
                                {empleado.apellido?.charAt(0)}
                              </div>
                              <div className="empleado-details">
                                <div className="empleado-name">
                                  {empleado.nombre} {empleado.apellido}
                                </div>
                                <div className="empleado-birth">
                                  {empleado.fecha_nacimiento}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="contact-cell">
                            <div className="contact-info">
                              <div className="contact-email">
                                {empleado.email}
                              </div>
                              <div className="contact-phone">
                                {formatearTelefono(empleado.telefono)}
                              </div>
                            </div>
                          </td>
                          <td className="role-cell">
                            <span
                              className={`role-badge ${empleado.departamento?.toLowerCase()}`}
                            >
                              {empleado.departamento || empleado.role}
                            </span>
                          </td>
                          <td className="dni-cell">
                            <span className="dni-text">{empleado.dni}</span>
                          </td>
                          <td className="age-cell">
                            <span className="age-text">
                              {calcularEdad(empleado.fecha_nacimiento)} años
                            </span>
                          </td>
                          <td className="status-cell">
                            <div
                              className={`status-badge ${
                                empleado.estado ? "active" : "inactive"
                              }`}
                            >
                              <div className="status-dot"></div>
                              <span>
                                {empleado.estado ? "Activo" : "Inactivo"}
                              </span>
                            </div>
                          </td>
                          <td className="actions-cell">
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteClick(empleado)}
                              title="Eliminar empleado"
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="3,6 5,6 21,6"></polyline>
                                <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal de confirmación */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={handleDeleteCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>🗑️ Confirmar eliminación</h3>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar al empleado?</p>
                <div className="empleado-preview">
                  <strong>
                    👷‍♂️ {empleadoToDelete?.nombre} {empleadoToDelete?.apellido}
                  </strong>
                  <span>📧 {empleadoToDelete?.email}</span>
                  <span>📄 DNI: {empleadoToDelete?.dni}</span>
                  <span>
                    🏢 Departamento:{" "}
                    {empleadoToDelete?.departamento || empleadoToDelete?.role}
                  </span>
                </div>
                <p className="warning-text">
                  ⚠️ Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={handleDeleteCancel}>
                  Cancelar
                </button>
                <button className="confirm-btn" onClick={handleDeleteConfirm}>
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Empleados;
