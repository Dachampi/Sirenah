import AdminSidebar from "../../components/layout/AdminSidebar.jsx"
import { useState, useEffect } from "react"
import "../../styles/stylesAdm/ATablas.css"
import "../../styles/stylesAdm/ListadoUsuarios.css"
import MiniProfile from "../../components/common/MiniProfile.jsx"
import { listarUsuarios } from "../../services/usuariosApi.js"
import { useNavigate } from "react-router-dom";

function Usuarios() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [usuarios, setUsuarios] = useState([])
  const [filteredUsuarios, setFilteredUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleCollapseChange = (collapsed) => {
    setIsCollapsed(collapsed)
  }

  useEffect(() => {
    const cargarUsuarios = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await listarUsuarios()
        setUsuarios(data)
        setFilteredUsuarios(data)
      } catch (err) {
        setError("Error al cargar la lista de usuarios")
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    cargarUsuarios()
  }, [])

  // Filtrado en tiempo real
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsuarios(usuarios)
    } else {
      const filtered = usuarios.filter((user) => {
        const searchLower = searchTerm.toLowerCase()
        const fullName = `${user.nombre} ${user.apellido}`.toLowerCase()
        const dni = user.dni?.toLowerCase() || ""
        const email = user.email?.toLowerCase() || ""

        return fullName.includes(searchLower) || dni.includes(searchLower) || email.includes(searchLower)
      })
      setFilteredUsuarios(filtered)
    }
  }, [searchTerm, usuarios])

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A"
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return "N/A"
    const hoy = new Date()
    const nacimiento = new Date(fechaNacimiento)
    let edad = hoy.getFullYear() - nacimiento.getFullYear()
    const mes = hoy.getMonth() - nacimiento.getMonth()
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--
    }
    return edad
  }

  const formatearTelefono = (telefono) => {
    if (!telefono) return "N/A"
    return telefono.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")
  }

  const handleDeleteClick = (user) => {
    setUserToDelete(user)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      // Aquí iría la llamada a la API para eliminar
      // await eliminarUsuario(userToDelete.id)

      // Por ahora solo removemos del estado local
      const updatedUsers = usuarios.filter((user) => user.id !== userToDelete.id)
      setUsuarios(updatedUsers)
      setFilteredUsuarios(
        updatedUsers.filter((user) => {
          if (!searchTerm.trim()) return true
          const searchLower = searchTerm.toLowerCase()
          const fullName = `${user.nombre} ${user.apellido}`.toLowerCase()
          const dni = user.dni?.toLowerCase() || ""
          const email = user.email?.toLowerCase() || ""
          return fullName.includes(searchLower) || dni.includes(searchLower) || email.includes(searchLower)
        }),
      )

      setShowDeleteModal(false)
      setUserToDelete(null)

      console.log("Eliminando usuario:", userToDelete.id)
    } catch (error) {
      console.error("Error al eliminar:", error)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setUserToDelete(null)
  }

  const navigate = useNavigate();

const handleNavigateToEmpleados = () => {
  navigate("/MenuAdmin/Empleados");
};

const handleNavigateToAdministradores = () => {
  navigate("/MenuAdmin/Administradores");
};


  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <div className="User-layout">
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 20px" }}>
        <MiniProfile />
      </div>

      <AdminSidebar onCollapseChange={handleCollapseChange} />

      <main style={{ marginTop: "0px" }} className={`content ${isCollapsed ? "collapsed" : ""}`}>
        <div className="user-container">
          <div className="user-card">
            {/* Header con navegación */}
            <div className="user-header">
              <div className="header-left">
                <h1 className="user-title">
                  <span className="title-icon">👥</span>
                  Usuarios
                </h1>
                <p className="user-subtitle">Gestiona los usuarios del sistema</p>
              </div>

              <div className="header-right">
                <div className="header-actions">
                  

                  <div className="nav-buttons">
                    <button className="nav-btn employees" onClick={handleNavigateToEmpleados}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      Ir a Empleados
                    </button>
                    <button className="nav-btn admins" onClick={handleNavigateToAdministradores}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      Ir a Administradores
                    </button>
                  </div>
                </div>

                {!loading && (
                  <div className="user-stats">
                    <div className="stat-item">
                      <span className="stat-number">{filteredUsuarios.length}</span>
                      <span className="stat-label">Mostrados</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{usuarios.filter((user) => user.estado).length}</span>
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  )}
                </div>
                {searchTerm && (
                  <div className="search-results">
                    ✨ {filteredUsuarios.length} resultado{filteredUsuarios.length !== 1 ? "s" : ""} encontrado
                    {filteredUsuarios.length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>

            <div className="user-content">
              {loading && (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <span className="loading-text">Cargando usuarios... ⏳</span>
                </div>
              )}

              {error && (
                <div className="error-alert">
                  <span className="error-text">❌ {error}</span>
                </div>
              )}

              {!loading && !error && filteredUsuarios.length === 0 && searchTerm && (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>No se encontraron resultados</h3>
                  <p>No hay usuarios que coincidan con "{searchTerm}"</p>
                  <button className="clear-filter-btn" onClick={clearSearch}>
                    Limpiar filtro
                  </button>
                </div>
              )}

              {!loading && !error && usuarios.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <h3>No hay usuarios</h3>
                  <p>Aún no se han registrado usuarios en el sistema</p>
                </div>
              )}

              {!loading && !error && filteredUsuarios.length > 0 && (
                <div className="table-container">
                  <table className="user-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>👤 Usuario</th>
                        <th>📧 Contacto</th>
                        <th>🏷️ Rol</th>
                        <th>📄 DNI</th>
                        <th>🎂 Edad</th>
                        <th>📊 Estado</th>
                        <th>⚙️ Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsuarios.map((user) => (
                        <tr key={user.id} className="table-row">
                          <td className="id-cell">
                            <span className="id-text">#{user.id}</span>
                          </td>
                          <td className="user-cell">
                            <div className="user-info">
                              <div className="user-avatar">
                                {user.nombre?.charAt(0)}
                                {user.apellido?.charAt(0)}
                              </div>
                              <div className="user-details">
                                <div className="user-name">
                                  {user.nombre} {user.apellido}
                                </div>
                                <div className="user-birth">{formatearFecha(user.fecha_nacimiento)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="contact-cell">
                            <div className="contact-info">
                              <div className="contact-email">{user.email}</div>
                              <div className="contact-phone">{formatearTelefono(user.telefono)}</div>
                            </div>
                          </td>
                          <td className="role-cell">
                            <span className={`role-badge ${user.role?.toLowerCase()}`}>{user.role}</span>
                          </td>
                          <td className="dni-cell">
                            <span className="dni-text">{user.dni}</span>
                          </td>
                          <td className="age-cell">
                            <span className="age-text">{calcularEdad(user.fecha_nacimiento)} años</span>
                          </td>
                          <td className="status-cell">
                            <div className={`status-badge ${user.estado ? "active" : "inactive"}`}>
                              <div className="status-dot"></div>
                              <span>{user.estado ? "Activo" : "Inactivo"}</span>
                            </div>
                          </td>
                          <td className="actions-cell">
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteClick(user)}
                              title="Eliminar usuario"
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
                <p>¿Estás seguro de que deseas eliminar al usuario?</p>
                <div className="user-preview">
                  <strong>
                    👤 {userToDelete?.nombre} {userToDelete?.apellido}
                  </strong>
                  <span>📧 {userToDelete?.email}</span>
                  <span>📄 DNI: {userToDelete?.dni}</span>
                </div>
                <p className="warning-text">⚠️ Esta acción no se puede deshacer.</p>
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
  )
}

export default Usuarios
