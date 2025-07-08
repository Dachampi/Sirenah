import AdminSidebar from "../../components/layout/AdminSidebar.jsx"
import { useState, useEffect } from "react"
import "../../styles/stylesAdm/ATablas.css"
import "../../styles/stylesAdm/ListadoAdministradores.css"
import MiniProfile from "../../components/common/MiniProfile.jsx"
import { listarAdministradores } from "../../services/administradoresApi.js"
import { useNavigate } from "react-router-dom";

function Administradores() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [administradores, setAdministradores] = useState([])
  const [filteredAdministradores, setFilteredAdministradores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [adminToDelete, setAdminToDelete] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleCollapseChange = (collapsed) => {
    setIsCollapsed(collapsed)
  }

  useEffect(() => {
    const cargarAdministradores = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await listarAdministradores()
        setAdministradores(data)
        setFilteredAdministradores(data)
      } catch (err) {
        setError("Error al cargar la lista de administradores")
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    cargarAdministradores()
  }, [])

  // Filtrado en tiempo real
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredAdministradores(administradores)
    } else {
      const filtered = administradores.filter((admin) => {
        const searchLower = searchTerm.toLowerCase()
        const fullName = `${admin.nombre} ${admin.apellido}`.toLowerCase()
        const dni = admin.dni?.toLowerCase() || ""
        const email = admin.email?.toLowerCase() || ""

        return fullName.includes(searchLower) || dni.includes(searchLower) || email.includes(searchLower)
      })
      setFilteredAdministradores(filtered)
    }
  }, [searchTerm, administradores])


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

  const handleDeleteClick = (admin) => {
    setAdminToDelete(admin)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      // Aquí iría la llamada a la API para eliminar
      // await eliminarAdministrador(adminToDelete.id)

      // Por ahora solo removemos del estado local
      const updatedAdmins = administradores.filter((admin) => admin.id !== adminToDelete.id)
      setAdministradores(updatedAdmins)
      setFilteredAdministradores(
        updatedAdmins.filter((admin) => {
          if (!searchTerm.trim()) return true
          const searchLower = searchTerm.toLowerCase()
          const fullName = `${admin.nombre} ${admin.apellido}`.toLowerCase()
          const dni = admin.dni?.toLowerCase() || ""
          const email = admin.email?.toLowerCase() || ""
          return fullName.includes(searchLower) || dni.includes(searchLower) || email.includes(searchLower)
        }),
      )

      setShowDeleteModal(false)
      setAdminToDelete(null)

      console.log("Eliminando administrador:", adminToDelete.id)
    } catch (error) {
      console.error("Error al eliminar:", error)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setAdminToDelete(null)
  }

  const navigate = useNavigate();

  const handleNavigateToEmpleados = () => {
    navigate("/MenuAdmin/empleados");
  };

  const handleNavigateToUsuarios = () => {
    navigate("/MenuAdmin/Usuarios");
  };

  const handleAddAdmin = () => {
    navigate("/MenuAdmin/Administradores/Agregar");
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <div className="Admin-layout">
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 20px" }}>
        <MiniProfile />
      </div>

      <AdminSidebar onCollapseChange={handleCollapseChange} />

      <main style={{ marginTop: "0px" }} className={`content ${isCollapsed ? "collapsed" : ""}`}>
        <div className="admin-container">
          <div className="admin-card">
            {/* Header con navegación */}
            <div className="admin-header">
              <div className="header-left">
                <h1 className="admin-title">
                  <span className="title-icon">👨‍💼</span>
                  Administradores
                </h1>
                <p className="admin-subtitle">Gestiona los usuarios administrativos del sistema</p>
              </div>

              <div className="header-right">
                <div className="header-actions">
                  <button className="add-admin-btn" onClick={handleAddAdmin}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="22" y1="11" x2="22" y2="17" />
                      <line x1="19" y1="14" x2="25" y2="14" />
                    </svg>
                    Agregar
                  </button>

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
                    <button className="nav-btn users" onClick={handleNavigateToUsuarios}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Ir a Usuarios
                    </button>
                  </div>
                </div>

                {!loading && (
                  <div className="admin-stats">
                    <div className="stat-item">
                      <span className="stat-number">{filteredAdministradores.length}</span>
                      <span className="stat-label">Mostrados</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{administradores.filter((admin) => admin.estado).length}</span>
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
                    ✨ {filteredAdministradores.length} resultado{filteredAdministradores.length !== 1 ? "s" : ""}{" "}
                    encontrado{filteredAdministradores.length !== 1 ? "s" : ""}
                  </div>
                )}
              </div>
            </div>

            <div className="admin-content">
              {loading && (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <span className="loading-text">Cargando administradores... ⏳</span>
                </div>
              )}

              {error && (
                <div className="error-alert">
                  <span className="error-text">❌ {error}</span>
                </div>
              )}

              {!loading && !error && filteredAdministradores.length === 0 && searchTerm && (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>No se encontraron resultados</h3>
                  <p>No hay administradores que coincidan con {searchTerm}</p>
                  <button className="clear-filter-btn" onClick={clearSearch}>
                    Limpiar filtro
                  </button>
                </div>
              )}

              {!loading && !error && administradores.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <h3>No hay administradores</h3>
                  <p>Aún no se han registrado administradores en el sistema</p>
                </div>
              )}

              {!loading && !error && filteredAdministradores.length > 0 && (
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>👤 Administrador</th>
                        <th>📧 Contacto</th>
                        <th>🏷️ Rol</th>
                        <th>📄 DNI</th>
                        <th>🎂 Edad</th>
                        <th>📊 Estado</th>
                        <th>⚙️ Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAdministradores.map((admin) => (
                        <tr key={admin.id} className="table-row">
                          <td className="id-cell">
                            <span className="id-text">#{admin.id}</span>
                          </td>
                          <td className="admin-cell">
                            <div className="admin-info">
                              <div className="admin-avatar">
                                {admin.nombre?.charAt(0)}
                                {admin.apellido?.charAt(0)}
                              </div>
                              <div className="admin-details">
                                <div className="admin-name">
                                  {admin.nombre} {admin.apellido}
                                </div>
                                <div className="admin-birth">{admin.fecha_nacimiento}</div>
                              </div>
                            </div>
                          </td>
                          <td className="contact-cell">
                            <div className="contact-info">
                              <div className="contact-email">{admin.email}</div>
                              <div className="contact-phone">{formatearTelefono(admin.telefono)}</div>
                            </div>
                          </td>
                          <td className="role-cell">
                            <span className={`role-badge ${admin.role?.toLowerCase()}`}>{admin.role}</span>
                          </td>
                          <td className="dni-cell">
                            <span className="dni-text">{admin.dni}</span>
                          </td>
                          <td className="age-cell">
                            <span className="age-text">{calcularEdad(admin.fecha_nacimiento)} años</span>
                          </td>
                          <td className="status-cell">
                            <div className={`status-badge ${admin.estado ? "active" : "inactive"}`}>
                              <div className="status-dot"></div>
                              <span>{admin.estado ? "Activo" : "Inactivo"}</span>
                            </div>
                          </td>
                          <td className="actions-cell">
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteClick(admin)}
                              title="Eliminar administrador"
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
                <p>¿Estás seguro de que deseas eliminar al administrador?</p>
                <div className="admin-preview">
                  <strong>
                    👤 {adminToDelete?.nombre} {adminToDelete?.apellido}
                  </strong>
                  <span>📧 {adminToDelete?.email}</span>
                  <span>📄 DNI: {adminToDelete?.dni}</span>
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

export default Administradores
