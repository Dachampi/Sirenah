import AdminSidebar from "../../components/layout/AdminSidebar"
import { useState, useEffect } from "react"
import {
  ListarCategorias,
  agregarCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../../services/categoriasApi"
import "../../styles/stylesAdm/ATablas.css"
import { useNavigate } from "react-router-dom"
import { AlertaDeEliminacion, AlertaDeExito, AlertaDeError } from "../../utils/Alertas"
import MiniProfile from "../../components/common/MiniProfile"

function Categorias() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [categorias, setCategorias] = useState([])
  const [error, setError] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const navigate = useNavigate()

  // Estado para errores de validación
  const [formErrors, setFormErrors] = useState({})

  const [categoryForm, setCategoryForm] = useState({
    idCategoria: "",
    nombre: "",
    descripcion: "",
  })

  const resetCategoryForm = () => {
    setCategoryForm({
      idCategoria: "",
      nombre: "",
      descripcion: "",
    })
    setFormErrors({})
    setError("")
  }

  const handleCollapseChange = (collapsed) => {
    setIsCollapsed(collapsed)
  }

  const fetchCategorias = async () => {
    try {
      const data = await ListarCategorias()
      setCategorias(data)
    } catch (error) {
      console.error(error)
      setError("Error al listar categorías")
      AlertaDeError("Error", "No se pudo obtener la lista de categorías")
    }
  }

  useEffect(() => {
    fetchCategorias()
  }, [])

  // Función para verificar si el nombre ya existe
  const checkDuplicateName = (nombre, excludeId = null) => {
    return categorias.some(
      (categoria) =>
        categoria.nombre.toLowerCase().trim() === nombre.toLowerCase().trim() && categoria.idCategoria !== excludeId,
    )
  }

  // Función de validación completa
  const validateForm = () => {
    const errors = {}

    // Validación del nombre
    if (!categoryForm.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio"
    } else if (categoryForm.nombre.trim().length < 2) {
      errors.nombre = "El nombre debe tener al menos 2 caracteres"
    } else if (categoryForm.nombre.trim().length > 50) {
      errors.nombre = "El nombre no puede exceder 50 caracteres"
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.&]+$/.test(categoryForm.nombre.trim())) {
      errors.nombre = "El nombre contiene caracteres no válidos"
    } else if (checkDuplicateName(categoryForm.nombre, categoryForm.idCategoria)) {
      errors.nombre = "Ya existe una categoría con este nombre"
    }

    // Validación de la descripción
    if (!categoryForm.descripcion.trim()) {
      errors.descripcion = "La descripción es obligatoria"
    } else if (categoryForm.descripcion.trim().length < 10) {
      errors.descripcion = "La descripción debe tener al menos 10 caracteres"
    } else if (categoryForm.descripcion.trim().length > 200) {
      errors.descripcion = "La descripción no puede exceder 200 caracteres"
    }

    setFormErrors(errors)

    // Si hay errores, mostrar el primero encontrado
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0]
      AlertaDeError("Error de validación", firstError)
      setError(firstError)
      return false
    }

    setError("")
    return true
  }

  // Validación en tiempo real para campos específicos
  const validateField = (fieldName, value) => {
    const errors = { ...formErrors }

    switch (fieldName) {
      case "nombre":
        if (!value.trim()) {
          errors.nombre = "El nombre es obligatorio"
        } else if (value.trim().length < 2) {
          errors.nombre = "Mínimo 2 caracteres"
        } else if (value.trim().length > 50) {
          errors.nombre = "Máximo 50 caracteres"
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.&]+$/.test(value.trim())) {
          errors.nombre = "Caracteres no válidos"
        } else if (checkDuplicateName(value, categoryForm.idCategoria)) {
          errors.nombre = "Nombre ya existe"
        } else {
          delete errors.nombre
        }
        break

      case "descripcion":
        if (!value.trim()) {
          errors.descripcion = "La descripción es obligatoria"
        } else if (value.trim().length < 10) {
          errors.descripcion = "Mínimo 10 caracteres"
        } else if (value.trim().length > 200) {
          errors.descripcion = "Máximo 200 caracteres"
        } else {
          delete errors.descripcion
        }
        break

      default:
        break
    }

    setFormErrors(errors)

    // Limpiar error general si no hay errores específicos
    if (Object.keys(errors).length === 0) {
      setError("")
    }
  }

  const handleInputChange = (field, value) => {
    setCategoryForm({ ...categoryForm, [field]: value })
    validateField(field, value)
  }

  const handleEditCategory = (categoria) => {
    setCategoryForm(categoria)
    setFormErrors({})
    setError("")
    setModalVisible(true)
  }

  const handleSaveEdit = async () => {
    if (validateForm()) {
      try {
        // Limpiar espacios en blanco antes de enviar
        const cleanedForm = {
          ...categoryForm,
          nombre: categoryForm.nombre.trim(),
          descripcion: categoryForm.descripcion.trim(),
        }

        await actualizarCategoria(categoryForm.idCategoria, cleanedForm)
        fetchCategorias()
        closeModal()
        AlertaDeExito("Categoría actualizada", "La categoría ha sido actualizada exitosamente")
      } catch (error) {
        console.error(error)
        setError("Error al editar categoría")
        AlertaDeError("Error", "No se pudo actualizar la categoría")
      }
    }
  }

  const handleAddCategory = async () => {
    if (validateForm()) {
      try {
        // Limpiar espacios en blanco antes de enviar
        const cleanedForm = {
          ...categoryForm,
          nombre: categoryForm.nombre.trim(),
          descripcion: categoryForm.descripcion.trim(),
        }

        await agregarCategoria(cleanedForm)
        fetchCategorias()
        closeModal()
        AlertaDeExito("Categoría añadida", "La categoría ha sido añadida exitosamente")
      } catch (error) {
        console.error(error)
        setError("Error al agregar categoría")
        AlertaDeError("Error", "No se pudo agregar la categoría")
      }
    }
  }

  const handleDeleteCategory = async (id) => {
    const result = await AlertaDeEliminacion(
      "¿Está seguro de que desea eliminar esta categoría?",
      "Esta acción no se puede deshacer y puede afectar a los productos asociados.",
    )

    if (result.isConfirmed) {
      try {
        await eliminarCategoria(id)
        fetchCategorias()
        AlertaDeExito("Categoría eliminada", "La categoría ha sido eliminada exitosamente")
      } catch (error) {
        console.error(error)
        setError("Error al eliminar categoría")

        // Mensaje más específico para errores de eliminación
        if (error.response?.status === 409 || error.message.includes("constraint")) {
          AlertaDeError(
            "No se puede eliminar",
            "Esta categoría tiene productos asociados. Elimine primero los productos o cámbielos de categoría.",
          )
        } else {
          AlertaDeError("Error", "No se pudo eliminar la categoría")
        }
      }
    }
  }

  const closeModal = () => {
    setModalVisible(false)
    resetCategoryForm()
  }

  // Función para limpiar el nombre mientras se escribe
  const handleNameChange = (value) => {
    // Remover caracteres especiales no permitidos automáticamente
    const cleanedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.&]/g, "")
    handleInputChange("nombre", cleanedValue)
  }

  return (
    <div className="Admin-layout">
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
      <main style={{ marginTop: "0px" }} className={`content ${isCollapsed ? "collapsed" : ""}`}>
        <div className="header-section">
          <h1>Gestión de Categorías</h1>
          <button
            onClick={() => {
              resetCategoryForm()
              setModalVisible(true)
            }}
            className="add-btn1"
          >
            + Añadir Categoría
          </button>
          <button onClick={() => navigate("/MenuAdmin/Productos")} className="add-btn2">
            Ir a Productos
          </button>
        </div>

        <div className="div-table">
          {categorias.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((categoria) => (
                  <tr key={categoria.idCategoria}>
                    <td>
                      <strong>{categoria.nombre}</strong>
                    </td>
                    <td>
                      <span title={categoria.descripcion}>
                        {categoria.descripcion.length > 50
                          ? `${categoria.descripcion.substring(0, 50)}...`
                          : categoria.descripcion}
                      </span>
                    </td>
                    <td>
                      <button onClick={() => handleEditCategory(categoria)} className="edit-btn">
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(categoria.idCategoria)}
                        className="delete-btn"
                        title={
                          categoria.productCount > 0 ? "Esta categoría tiene productos asociados" : "Eliminar categoría"
                        }
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>No hay categorías disponibles</p>
              <button
                onClick={() => {
                  resetCategoryForm()
                  setModalVisible(true)
                }}
                className="add-btn1"
              >
                Crear primera categoría
              </button>
            </div>
          )}
        </div>

        {modalVisible && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>{categoryForm.idCategoria ? "Editar Categoría" : "Añadir Categoría"}</h2>
              <form>
                <label>
                  Nombre de la Categoría *
                  {formErrors.nombre && <span className="error-text"> - {formErrors.nombre}</span>}
                </label>
                <input
                  type="text"
                  value={categoryForm.nombre}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={formErrors.nombre ? "input-error" : ""}
                  maxLength="50"
                  placeholder="Ej: Electrónicos, Ropa, Hogar..."
                />
                <div className="char-counter">{categoryForm.nombre.length}/50 caracteres</div>

                <label>
                  Descripción *
                  {formErrors.descripcion && <span className="error-text"> - {formErrors.descripcion}</span>}
                </label>
                <textarea
                  value={categoryForm.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  className={formErrors.descripcion ? "input-error" : ""}
                  maxLength="200"
                  rows="4"
                  placeholder="Describe qué tipo de productos incluye esta categoría (mínimo 10 caracteres)"
                />
                <div className="char-counter">{categoryForm.descripcion.length}/200 caracteres</div>

                <div className="form-tips">
                  <h4>💡 Consejos:</h4>
                  <ul>
                    <li>Usa nombres descriptivos y únicos</li>
                    <li>Evita caracteres especiales excepto guiones y puntos</li>
                    <li>La descripción ayuda a los usuarios a entender la categoría</li>
                  </ul>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={categoryForm.idCategoria ? handleSaveEdit : handleAddCategory}
                    className="save-btn"
                    disabled={Object.keys(formErrors).length > 0}
                  >
                    {categoryForm.idCategoria ? "Guardar Cambios" : "Crear Categoría"}
                  </button>
                  <button type="button" onClick={closeModal} className="cancel-btn">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}
      </main>
    </div>
  )
}

export default Categorias
