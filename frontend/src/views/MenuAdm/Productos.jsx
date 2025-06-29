import AdminSidebar from "../../components/layout/AdminSidebar";
import { useState, useEffect } from "react";
import {
  listarProductos,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
} from "../../services/productosApi";
import { ListarCategorias } from "../../services/categoriasApi";
import "../../styles/stylesAdm/ATablas.css";
import { useNavigate } from "react-router-dom";
import {
  AlertaDeEliminacion,
  AlertaDeError,
  AlertaDeExito,
} from "../../utils/Alertas.js";
import MiniProfile from "../../components/common/MiniProfile.jsx";

function Productos() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState({});

  const [productForm, setProductForm] = useState({
    idProducto: "",
    idCategoria: "",
    nombre: "",
    estado: true,
    stock: "",
    precio: "",
    stockMinimo: "",
    descripcion: "",
    imgUrl: "",
  });

  const resetProductForm = () => {
    setProductForm({
      idProducto: "",
      idCategoria: "",
      nombre: "",
      estado: true,
      stock: "",
      precio: "",
      stockMinimo: "",
      descripcion: "",
      imgUrl: "",
    });
    setFormErrors({});
  };

  const handleCollapseChange = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  const fetchProductos = async () => {
    try {
      const data = await listarProductos();
      setProductos(data);
    } catch (error) {
      console.error(error);
      AlertaDeError("Error", "Error al listar productos");
    }
  };

  const fetchCategorias = async () => {
    try {
      const data = await ListarCategorias();
      setCategorias(data);
    } catch (error) {
      console.error(error);
      AlertaDeError("Error", "Error al listar categorías");
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  const validateForm = () => {
    const errors = {};

    // Validación del nombre
    if (!productForm.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio";
    } else if (productForm.nombre.trim().length < 2) {
      errors.nombre = "El nombre debe tener al menos 2 caracteres";
    } else if (productForm.nombre.trim().length > 40) {
      errors.nombre = "El nombre no puede exceder 40 caracteres";
    } else if (
      !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_.]+$/.test(productForm.nombre.trim())
    ) {
      errors.nombre = "El nombre contiene caracteres no válidos";
    }

    // Validación de categoría
    if (!productForm.idCategoria) {
      errors.idCategoria = "Debe seleccionar una categoría";
    }

    // Validación del precio
    if (!productForm.precio) {
      errors.precio = "El precio es obligatorio";
    } else {
      const precio = Number.parseFloat(productForm.precio);
      if (isNaN(precio)) {
        errors.precio = "El precio debe ser un número válido";
      } else if (precio <= 0) {
        errors.precio = "El precio debe ser mayor a 0";
      } else if (precio > 999999.99) {
        errors.precio = "El precio no puede exceder S/. 999,999.99";
      } else if (!/^\d+(\.\d{1,2})?$/.test(productForm.precio)) {
        errors.precio = "El precio debe tener máximo 2 decimales";
      }
    }

    // Validación del stock
    if (!productForm.stock && productForm.stock !== 0) {
      errors.stock = "El stock es obligatorio";
    } else {
      const stock = Number(productForm.stock);
      if (isNaN(stock)) {
        errors.stock = "El stock debe ser un número entero";
      } else if (!Number.isInteger(stock)) {
        errors.stock = "El stock no puede tener decimales";
      } else if (stock < 0) {
        errors.stock = "El stock no puede ser negativo";
      } else if (stock > 999999) {
        errors.stock = "El stock no puede exceder 999,999 unidades";
      }
    }

    // Validación del stock mínimo
    if (!productForm.stockMinimo && productForm.stockMinimo !== 0) {
      errors.stockMinimo = "El stock mínimo es obligatorio";
    } else {
      const stockMinimo = Number(productForm.stockMinimo);
      const stock = Number(productForm.stock);

      if (isNaN(stockMinimo)) {
        errors.stockMinimo = "El stock mínimo debe ser un número entero";
      } else if (!Number.isInteger(stockMinimo)) {
        errors.stockMinimo = "El stock mínimo no puede tener decimales";
      } else if (stockMinimo < 0) {
        errors.stockMinimo = "El stock mínimo no puede ser negativo";
      } else if (stockMinimo > 999999) {
        errors.stockMinimo =
          "El stock mínimo no puede exceder 999,999 unidades";
      } else if (!isNaN(stock) && stockMinimo > stock) {
        errors.stockMinimo =
          "El stock mínimo no puede ser mayor al stock actual";
      }
    }

    // Validación de la descripción
    if (!productForm.descripcion.trim()) {
      errors.descripcion = "La descripción es obligatoria";
    } else if (productForm.descripcion.trim().length < 10) {
      errors.descripcion = "La descripción debe tener al menos 10 caracteres";
    } else if (productForm.descripcion.trim().length > 500) {
      errors.descripcion = "La descripción no puede exceder 500 caracteres";
    }

    // Validación de la imagen
    if (!productForm.imgUrl.trim()) {
      errors.imgUrl = "La imagen es obligatoria";
    }

    setFormErrors(errors);

    // Si hay errores, mostrar el primero encontrado
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      AlertaDeError("Error", firstError);
      return false;
    }

    return true;
  };

  // Validación en tiempo real para campos específicos
  const validateField = (fieldName, value) => {
    const errors = { ...formErrors };

    switch (fieldName) {
      case "nombre":
        if (!value.trim()) {
          errors.nombre = "El nombre es obligatorio";
        } else if (value.trim().length < 2) {
          errors.nombre = "Mínimo 2 caracteres";
        } else if (value.trim().length > 30) {
          errors.nombre = "Máximo 30 caracteres";
        } else {
          delete errors.nombre;
        }
        break;
      case "idCategoria":
        if (!value) {
          errors.idCategoria = "Debe seleccionar una categoría";
        } else {
          delete errors.idCategoria;
        }
        break;

      case "precio":
        if (!value) {
          errors.precio = "El precio es obligatorio";
        } else if (
          isNaN(Number.parseFloat(value)) ||
          Number.parseFloat(value) <= 0
        ) {
          errors.precio = "Precio inválido";
        } else {
          delete errors.precio;
        }
        break;

      case "stock":
        if (!value && value !== 0) {
          errors.stock = "El stock es obligatorio";
        } else if (
          isNaN(Number(value)) ||
          Number(value) < 0 ||
          !Number.isInteger(Number(value))
        ) {
          errors.stock = "El stock debe ser un número entero no negativo";
        } else {
          delete errors.stock;
        }
        break;

      case "stockMinimo":
        if (!value && value !== 0) {
          errors.stockMinimo = "El stock mínimo es obligatorio";
        } else if (
          isNaN(Number(value)) ||
          Number(value) < 0 ||
          !Number.isInteger(Number(value))
        ) {
          errors.stockMinimo =
            "El stock mínimo debe ser un número entero no negativo";
        } else {
          delete errors.stockMinimo;
        }
        break;

      case "descripcion":
        if (!value.trim()) {
          errors.descripcion = "La descripción es obligatoria";
        } else if (value.trim().length < 10) {
          errors.descripcion = "Mínimo 10 caracteres";
        } else {
          delete errors.descripcion;
        }
        break;

      default:
        break;
    }

    setFormErrors(errors);
  };

  const handleInputChange = (field, value) => {
    setProductForm({ ...productForm, [field]: value });
    validateField(field, value);
  };

  const handleEditProduct = (producto) => {
    setProductForm(producto);
    setFormErrors({});
    setModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (validateForm()) {
      try {
        await actualizarProducto(productForm.idProducto, {
          ...productForm,
          precio: Number.parseFloat(productForm.precio),
          stock: Number.parseInt(productForm.stock),
          stockMinimo: Number.parseInt(productForm.stockMinimo),
        });
        fetchProductos();
        closeModal();
        AlertaDeExito(
          "Producto Actualizado",
          "El producto ha sido actualizado exitosamente."
        );
      } catch (error) {
        console.error(error);
        AlertaDeError("Error", "Error al editar producto");
      }
    }
  };

  const handleAddProduct = async () => {
    if (validateForm()) {
      try {
        await agregarProducto({
          ...productForm,
          precio: Number.parseFloat(productForm.precio),
          stock: Number.parseInt(productForm.stock),
          stockMinimo: Number.parseInt(productForm.stockMinimo),
        });
        fetchProductos();
        closeModal();
        AlertaDeExito(
          "Producto Añadido",
          "El producto ha sido añadido exitosamente."
        );
      } catch (error) {
        console.error(error);
        AlertaDeError("Error", "Error al agregar producto");
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    const result = await AlertaDeEliminacion(
      "¿Está seguro de que desea eliminar este producto?",
      "Esta acción no se puede deshacer."
    );

    if (result.isConfirmed) {
      try {
        await eliminarProducto(id);
        fetchProductos();
        AlertaDeExito(
          "Producto Eliminado",
          "El producto ha sido eliminado exitosamente."
        );
      } catch (error) {
        console.error(error);
        AlertaDeError("Error", "Error al eliminar producto");
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    resetProductForm();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar tipo de archivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      AlertaDeError("Error", "Solo se permiten archivos JPG, PNG o WebP");
      return;
    }

    // Validar tamaño del archivo (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      AlertaDeError("Error", "La imagen no puede exceder 5MB");
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
      img.onload = async () => {
        const minWidth = 600;
        const minHeight = 400;
        const maxWidth = 1200;
        const maxHeight = 800;

        if (img.width < minWidth || img.height < minHeight) {
          AlertaDeError(
            "Error",
            `La imagen debe tener al menos ${minWidth}x${minHeight} píxeles.`
          );
          return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (img.width > maxWidth || img.height > maxHeight) {
          const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        // Configurar crossOrigin para evitar problemas de CORS
        img.crossOrigin = "anonymous";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          async (blob) => {
            const formData = new FormData();
            formData.append("file", blob, file.name);
            formData.append("upload_preset", "Preset_Sirenah");

            try {
              const response = await fetch(
                `https://api.cloudinary.com/v1_1/${
                  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
                }/image/upload`,
                {
                  method: "POST",
                  body: formData,
                }
              );

              const data = await response.json();
              if (data.secure_url) {
                setProductForm({ ...productForm, imgUrl: data.secure_url });
                // Limpiar error de imagen si existía
                const errors = { ...formErrors };
                delete errors.imgUrl;
                setFormErrors(errors);
                AlertaDeExito(
                  "Imagen Cargada",
                  "La imagen se ha subido exitosamente."
                );
              } else {
                throw new Error("No se pudo obtener la URL de la imagen");
              }
            } catch (error) {
              console.error(error);
              AlertaDeError("Error", "Error al cargar la imagen");
            }
          },
          "image/jpeg",
          0.8
        );
      };
    };

    reader.readAsDataURL(file);
  };

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
      <main
        style={{ marginTop: "0px" }}
        className={`content ${isCollapsed ? "collapsed" : ""}`}
      >
        <div className="header-section">
          <h1>Gestión de Productos</h1>
          <button
            onClick={() => {
              resetProductForm();
              setModalVisible(true);
            }}
            className="add-btn1"
          >
            + Añadir Producto
          </button>
          <button
            onClick={() => navigate("/MenuAdmin/Categorias")}
            className="add-btn2"
          >
            Ir a Categorías
          </button>
        </div>

        <div className="div-table">
          {productos.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Stock Mínimo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.idProducto}>
                    <td>
                      {producto.imgUrl ? (
                        <img
                          src={producto.imgUrl || "/placeholder.svg"}
                          alt={producto.nombre}
                          className="product-image"
                        />
                      ) : (
                        "No Disponible"
                      )}
                    </td>
                    <td>{producto.nombre}</td>
                    <td>
                      {categorias.find(
                        (categoria) =>
                          categoria.idCategoria === producto.idCategoria
                      )?.nombre || "Sin categoría"}
                    </td>
                    <td>S/. {producto.precio.toFixed(2)}</td>
                    <td>{producto.stock}</td>
                    <td>{producto.stockMinimo}</td>
                    <td>{producto.estado ? "Activo" : "Inactivo"}</td>
                    <td>
                      <button
                        onClick={() => handleEditProduct(producto)}
                        className="edit-btn"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(producto.idProducto)}
                        className="delete-btn"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay productos disponibles</p>
          )}
        </div>

        {modalVisible && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>
                {productForm.idProducto ? "Editar Producto" : "Añadir Producto"}
              </h2>
              <form>
                <label>
                  Nombre *
                  {formErrors.nombre && (
                    <span className="error-text"> - {formErrors.nombre}</span>
                  )}
                </label>
                <input
                  type="text"
                  value={productForm.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  className={formErrors.nombre ? "input-error" : ""}
                  maxLength="100"
                />

                <label>
                  Categoría *
                  {formErrors.idCategoria && (
                    <span className="error-text">
                      {" "}
                      - {formErrors.idCategoria}
                    </span>
                  )}
                </label>
                <select
                  className={`select-style ${
                    formErrors.idCategoria ? "input-error" : ""
                  }`}
                  value={productForm.idCategoria}
                  onChange={(e) =>
                    handleInputChange("idCategoria", e.target.value)
                  }
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((categoria) => (
                    <option
                      key={categoria.idCategoria}
                      value={categoria.idCategoria}
                    >
                      {categoria.nombre}
                    </option>
                  ))}
                </select>

                <label>
                  Precio (S/.) *
                  {formErrors.precio && (
                    <span className="error-text"> - {formErrors.precio}</span>
                  )}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="999999.99"
                  value={productForm.precio}
                  onChange={(e) => handleInputChange("precio", e.target.value)}
                  className={formErrors.precio ? "input-error" : ""}
                />

                <label>
                  Stock *
                  {formErrors.stock && (
                    <span className="error-text"> - {formErrors.stock}</span>
                  )}
                </label>
                <input
                  type="number"
                  min="0"
                  max="999999"
                  value={productForm.stock}
                  onChange={(e) => handleInputChange("stock", e.target.value)}
                  className={formErrors.stock ? "input-error" : ""}
                />

                <label>
                  Stock Mínimo *
                  {formErrors.stockMinimo && (
                    <span className="error-text">
                      {" "}
                      - {formErrors.stockMinimo}
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  min="0"
                  max="999999"
                  value={productForm.stockMinimo}
                  onChange={(e) =>
                    handleInputChange("stockMinimo", e.target.value)
                  }
                  className={formErrors.stockMinimo ? "input-error" : ""}
                />

                <label>
                  Descripción *
                  {formErrors.descripcion && (
                    <span className="error-text">
                      {" "}
                      - {formErrors.descripcion}
                    </span>
                  )}
                </label>
                <textarea
                  value={productForm.descripcion}
                  onChange={(e) =>
                    handleInputChange("descripcion", e.target.value)
                  }
                  className={formErrors.descripcion ? "input-error" : ""}
                  maxLength="500"
                  rows="4"
                  placeholder="Describe el producto (mínimo 10 caracteres)"
                />
                <div className="char-counter">
                  {productForm.descripcion.length}/500 caracteres
                </div>

                <label>
                  Imagen del Producto *
                  {formErrors.imgUrl && (
                    <span className="error-text"> - {formErrors.imgUrl}</span>
                  )}
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className={formErrors.imgUrl ? "input-error" : ""}
                />
                <small className="help-text">
                  Formatos permitidos: JPG, PNG, WebP. Tamaño máximo: 5MB.
                  Dimensiones mínimas: 600x400px
                </small>

                {productForm.imgUrl && (
                  <div className="image-preview">
                    <img
                      src={productForm.imgUrl || "/placeholder.svg"}
                      alt="Vista previa"
                      style={{
                        maxWidth: "200px",
                        maxHeight: "150px",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={
                      productForm.idProducto ? handleSaveEdit : handleAddProduct
                    }
                    disabled={Object.keys(formErrors).length > 0}
                    className="save-btn"
                  >
                    {productForm.idProducto ? "Guardar" : "Añadir"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="cancel-btn"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Productos;
