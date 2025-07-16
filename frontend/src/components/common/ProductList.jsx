import Tarjeta from "./Tarjeta";
import "../../styles/Catalogo.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { AlertaDeExito } from "../../utils/Alertas";
import Loading from "../common/Loanding.jsx";
import { FaCartPlus, FaHeart } from 'react-icons/fa';
import { obtenerUsuarioId } from "../../services/todosroles.js";

const token = localStorage.getItem("token");
axios.interceptors.request.use(
  (config) => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function ProductList() {
  const [isDarkMode] = useState(false);
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoanding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [seleccionado, setSeleccionado] = useState([]);

  const [filtro, setFiltro] = useState({
    nombre: "",
    categoria: "",
    marca: "",
    precioMin: 0,
    precioMax: 5000,
    stock: false,
    descuento: false,
    ordenar: "nombreAsc",
  });

  useEffect(() => {
    setIsLoanding(true);
    const obtenerProductos = async () => {
      try {
        const respuesta = await fetch(
          `${import.meta.env.VITE_API}/public/Productos/Listar`
        );
        const datos = await respuesta.json();
        setProductos(datos);
        setProductosFiltrados(datos);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      } finally {
        setIsLoanding(false);
      }
    };

        const obtenerCategorias = async () => {
      try {
        const respuesta = await fetch(
          `${import.meta.env.VITE_API}/public/Categorias/Listar`
        );
        const datos = await respuesta.json();
        setCategorias(datos);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };

    obtenerProductos();
    obtenerCategorias();
  }, []);

  const manejarAgregarCarrito = async (producto) => {
    try {
      const usuarioId =await obtenerUsuarioId();
      const token = localStorage.getItem("token");

            let carrito;

      try {
        const carritoResponse = await fetch(
          `${import.meta.env.VITE_API}/todosroles/carrito/obtener/${usuarioId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (403 == carritoResponse.status) {
          const carritoCreadoResponse = await fetch(
            `${import.meta.env.VITE_API}/todosroles/carrito/crear/${usuarioId}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          carrito = await carritoCreadoResponse.json();
        } else {
          carrito = await carritoResponse.json();
        }
              } catch (error) {
        return;
      }

            try {
        const agregarProductoResponse = await fetch(
          `${import.meta.env.VITE_API}/todosroles/carrito/${
            carrito.idCarrito
          }/detalle?idProducto=${
            producto.idProducto
          }&cantidad=${1}&precioUnitario=${producto.precio}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!agregarProductoResponse.ok) {
          throw new Error("Error al agregar el producto al carrito.");
        }

        AlertaDeExito("¡Exito!", "Producto agregado al carrito con éxito.");
      } catch (error) {
        console.error("Error al agregar producto al carrito:", error);
        alert("Hubo un error al agregar el producto al carrito.");
      }
    } catch (error) {
      console.error("Error al manejar el carrito:", error);
      alert("Hubo un error al agregar el producto al carrito.");
    }
  };

  const manejarVerDetalles = (producto) => {
    setSeleccionado(producto);
    console.log(seleccionado)
    setIsModalOpen(true);
  };

  const manejarAplicarFiltros = () => {
    let productosFiltrados = productos.filter((producto) => {
      const nombreCoincide = producto.nombre
        .toLowerCase()
        .includes(filtro.nombre.toLowerCase());
      const categoriaCoincide = filtro.categoria
        ? producto.idCategoria === filtro.categoria
        : true;
      const precioCoincide =
        producto.precio >= filtro.precioMin &&
        producto.precio <= filtro.precioMax;
      const stockCoincide = filtro.stock ? producto.stock > 0 : true;

      return (
        nombreCoincide && categoriaCoincide && precioCoincide && stockCoincide
      );
    });

        if (filtro.ordenar === "nombreAsc") {
      productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (filtro.ordenar === "nombreDesc") {
      productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
    } else if (filtro.ordenar === "precioAsc") {
      productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (filtro.ordenar === "precioDesc") {
      productosFiltrados.sort((a, b) => b.precio - a.precio);
    }

    setProductosFiltrados(productosFiltrados);
  };

  const manejarLimpiarFiltros = () => {
    setFiltro({
      nombre: "",
      categoria: "",
      marca: "",
      precioMin: 0,
      precioMax: 5000,
      stock: false,
      descuento: false,
      ordenar: "nombreAsc",
    });
    setProductosFiltrados(productos);
  };

  return (
    <main className={`catalogo ${isDarkMode ? "dark-mode" : ""}`}>
      {isLoading && (
        <Loading message="Obteniendo productos, por favor espera..." />
      )}
      <div className="filtros-catalogo">
        <div className="filtro-item">
          <label htmlFor="nombre">Buscar por nombre:</label>
          <input
            type="text"
            id="nombre"
            value={filtro.nombre}
            onChange={(e) => setFiltro({ ...filtro, nombre: e.target.value })}
            className="form-control"
            placeholder="Ej. Camiseta"
          />
        </div>

        <div className="filtro-item">
          <label htmlFor="categoria">Filtrar por categoría:</label>
          <select
            id="categoria"
            value={filtro.categoria}
            onChange={(e) =>
              setFiltro({ ...filtro, categoria: parseInt(e.target.value) })
            }
            className="form-control"
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.idCategoria} value={categoria.idCategoria}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro-item">
          <label>
            <input
              type="checkbox"
              checked={filtro.stock}
              onChange={(e) =>
                setFiltro({ ...filtro, stock: e.target.checked })
              }
            />
            Solo productos en stock
          </label>
        </div>

        <div className="filtro-item">
          <label htmlFor="ordenar">Ordenar por:</label>
          <select
            id="ordenar"
            value={filtro.ordenar}
            onChange={(e) => setFiltro({ ...filtro, ordenar: e.target.value })}
            className="form-control"
          >
            <option value="nombreAsc">Nombre (A-Z)</option>
            <option value="nombreDesc">Nombre (Z-A)</option>
            <option value="precioAsc">Precio (menor a mayor)</option>
            <option value="precioDesc">Precio (mayor a menor)</option>
          </select>
        </div>

        <button className="aplicar-filtros" onClick={manejarAplicarFiltros}>
          Aplicar Filtros
        </button>
        <button className="limpiar-filtros" onClick={manejarLimpiarFiltros}>
          Limpiar Filtros
        </button>
      </div>

      <div className="tarjetas-catalogo">
        {productosFiltrados.map((producto) => (
          <Tarjeta
            key={producto.idProducto}
            producto={producto}
            alAgregarCarrito={() => manejarAgregarCarrito(producto)}
            alAgregarListaDeseos={(producto) =>
              console.log("Producto agregado a la lista de deseos:", producto)
            }
            alVerDetalles={() => manejarVerDetalles(producto)}
          />
        ))}
      </div>
      {isModalOpen && (
        <div className={`modal-detalles ${isModalOpen ? "open" : ""}`}>
          <div className="modal-detalles-content">
            <button
              className="close-modal"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <div className="modal__contenido">
              <div className="modal__encabezado">
                <h2>{seleccionado.nombre}</h2>
              </div>
              <div className="modal__cuerpo">
                <img src={seleccionado.imgUrl} alt={seleccionado.nombre} />
                <p>{seleccionado.descripcion}</p>
                <p>
                  <strong>Precio:</strong> S/. {seleccionado.precio.toFixed(2)}
                </p>
                <p>
                  <strong>Stock disponible:</strong> {seleccionado.stock}
                </p>
                <p>
                  <strong>Categoría:</strong>{" "}
                  {categorias.find(
                    (categoria) =>
                      categoria.idCategoria === seleccionado.idCategoria
                  )?.nombre || "Sin categoría"}
                </p>
              </div>
              <div className="tarjeta__botones">
                    <div
                        className="tarjeta__icono-contenedor"
                        onClick={() => manejarAgregarCarrito(seleccionado)}
                    >
                        <FaCartPlus className="tarjeta__icono" />
                        <span className="tarjeta__tooltip">Agregar al Carrito</span>
                    </div>
                    <div
                        className="tarjeta__icono-contenedor"
                        onClick={() => console.log("Producto añadido a la lista de deseos")}
                    >
                        <FaHeart className="tarjeta__icono" />
                        <span className="tarjeta__tooltip">Lista de Deseos</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default ProductList;
