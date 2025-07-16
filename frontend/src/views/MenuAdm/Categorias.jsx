import AdminSidebar from "../../components/layout/AdminSidebar"
import { useState, useEffect } from "react"
import {
  ListarCategorias,
  agregarCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../../services/categoriasApi"
import { useNavigate } from "react-router-dom"
import { AlertaDeEliminacion, AlertaDeExito, AlertaDeError } from "../../utils/Alertas"
import MiniProfile from "../../components/common/MiniProfile"

import "../../styles/stylesAdm/ACategorias.css"

import { Tag, PlusCircle, Edit, Trash2, Package, Lightbulb, XCircle, Save, AlertTriangle, Info } from "lucide-react"

function Categorias() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [categorias, setCategorias] = useState([])
  const [error, setError] = useState("")
  const [modalVisible, setModalVisible] = useState(false)
  const navigate = useNavigate()
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

    const checkDuplicateName = (nombre, excludeId = null) => {
    return categorias.some(
      (categoria) =>
        categoria.nombre.toLowerCase().trim() === nombre.toLowerCase().trim() && categoria.idCategoria !== excludeId,
    )
  }

    const validateForm = () => {
    const errors = {}
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
        if (!categoryForm.descripcion.trim()) {
      errors.descripcion = "La descripción es obligatoria"
    } else if (categoryForm.descripcion.trim().length < 10) {
      errors.descripcion = "La descripción debe tener al menos 10 caracteres"
    } else if (categoryForm.descripcion.trim().length > 200) {
      errors.descripcion = "La descripción no puede exceder 200 caracteres"
    }
    setFormErrors(errors)
        if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0]
      AlertaDeError("Error de validación", firstError)
      setError(firstError)
      return false
    }
    setError("")
    return true
  }

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

    const handleNameChange = (value) => {
        const cleanedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.&]/g, "")
    handleInputChange("nombre", cleanedValue)
  }

  return (
    <div className="gcategorias-admin-layout">
      <AdminSidebar onCollapseChange={handleCollapseChange} />
      <main  style={{ marginTop: "0px" }} className={`content ${isCollapsed ? "collapsed" : ""}`}>
        <div className="gcategorias-profile-container">
          <MiniProfile />
        </div>
        <div className="gcategorias-header-section">
          <div className="gcategorias-header-content">
            <div className="gcategorias-header-title-group">
              <Tag className="gcategorias-header-icon" /> {/* Icono para Categorías */}
              <h1 className="gcategorias-header-title">Gestión de Categorías</h1>
            </div>
            <div className="gcategorias-header-buttons">
              <button
                onClick={() => {
                  resetCategoryForm()
                  setModalVisible(true)
                }}
                className="gcategorias-add-btn"
              >
                <PlusCircle size={20} />
                Añadir Categoría
              </button>
              <button onClick={() => navigate("/MenuAdmin/Productos")} className="gcategorias-navigate-btn">
                <Package size={20} /> {/* Icono para Productos */}
                Ir a Productos
              </button>
            </div>
          </div>
        </div>
        <div className="gcategorias-div-table">
          {categorias.length > 0 ? (
            <table className="gcategorias-table">
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
                    <td className="gcategorias-actions-cell">
                      <button onClick={() => handleEditCategory(categoria)} className="gcategorias-edit-btn">
                        <Edit size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(categoria.idCategoria)}
                        className="gcategorias-delete-btn"
                        title={
                          categoria.productCount > 0 ? "Esta categoría tiene productos asociados" : "Eliminar categoría"
                        }
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="gcategorias-no-categories">
              <Tag className="gcategorias-empty-icon" />
              <p>No hay categorías disponibles</p>
              <button
                onClick={() => {
                  resetCategoryForm()
                  setModalVisible(true)
                }}
                className="gcategorias-add-btn"
              >
                <PlusCircle size={20} />
                Crear primera categoría
              </button>
            </div>
          )}
        </div>
        {modalVisible && (
          <div className="gcategorias-modal-overlay" onClick={closeModal}>
            <div className="gcategorias-modal" onClick={(e) => e.stopPropagation()}>
              <h2>{categoryForm.idCategoria ? "Editar Categoría" : "Añadir Categoría"}</h2>
              <form>
                <label>
                  <Tag size={16} />
                  Nombre de la Categoría *
                  {formErrors.nombre && <span className="gcategorias-error-text"> - {formErrors.nombre}</span>}
                </label>
                <input
                  type="text"
                  value={categoryForm.nombre}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={formErrors.nombre ? "gcategorias-input-error" : ""}
                  maxLength="50"
                  placeholder="Ej: Electrónicos, Ropa, Hogar..."
                />
                <div className="gcategorias-char-counter">{categoryForm.nombre.length}/50 caracteres</div>
                <label>
                  <Info size={16} />
                  Descripción *
                  {formErrors.descripcion && (
                    <span className="gcategorias-error-text"> - {formErrors.descripcion}</span>
                  )}
                </label>
                <textarea
                  value={categoryForm.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  className={formErrors.descripcion ? "gcategorias-input-error" : ""}
                  maxLength="200"
                  rows="4"
                  placeholder="Describe qué tipo de productos incluye esta categoría (mínimo 10 caracteres)"
                />
                <div className="gcategorias-char-counter">{categoryForm.descripcion.length}/200 caracteres</div>
                <div className="gcategorias-form-tips">
                  <h4>
                    <Lightbulb size={18} />
                    Consejos:
                  </h4>
                  <ul>
                    <li>Usa nombres descriptivos y únicos</li>
                    <li>Evita caracteres especiales excepto guiones y puntos</li>
                    <li>La descripción ayuda a los usuarios a entender la categoría</li>
                  </ul>
                </div>
                <div className="gcategorias-modal-actions">
                  <button
                    type="button"
                    onClick={categoryForm.idCategoria ? handleSaveEdit : handleAddCategory}
                    className="gcategorias-save-btn"
                    disabled={Object.keys(formErrors).length > 0}
                  >
                    <Save size={20} />
                    {categoryForm.idCategoria ? "Guardar Cambios" : "Crear Categoría"}
                  </button>
                  <button type="button" onClick={closeModal} className="gcategorias-cancel-btn">
                    <XCircle size={20} />
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {error && (
          <div className="gcategorias-error-message">
            <AlertTriangle size={20} />
            <strong>Error:</strong> {error}
          </div>
        )}
      </main>
    </div>
  )
}

export default Categorias
