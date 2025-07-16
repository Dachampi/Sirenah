import { FaShoppingCart, FaUser, FaMoon, FaSun, FaBars } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "../../styles/Header.css";
import { useState } from "react";
import useAutenticacion from '../hooks/Autenticacion';
import { FaTrash } from 'react-icons/fa';
import Loading from "../common/Loanding.jsx"
import { obtenerUsuarioId } from "../../services/todosroles.js";
import { eliminarProductoDelCarrito } from "../../services/CarritoService/DeleteProductoCarrito.js";
import { aumentarProductoCarrito, disminuirProductoCarrito } from "../../services/CarritoService/AumDisProductoCarrito.js";
import { vaciarCarrito } from "../../services/CarritoService/VaciarCarrito.js";
const Header = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading1, setIsLoading1] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const { isAuthenticated, userRole } = useAutenticacion();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.body.classList.toggle("dark-mode", !isDarkMode);
    };

    const PerfilClick = () => {
        if (isAuthenticated) {
            if (userRole === "ADMIN" || userRole === "EMPLEADO") {
                navigate("/MenuAdmin/Perfil");
            } else if (userRole === "USER") {
                navigate("/MenuCliente/Perfil");
            }
        } else {
            navigate("/Login");
        }
    };


    const toggleCartModal = async () => {
        try {
            setIsLoading(true);
            
            const userId = await obtenerUsuarioId();


            if (!isCartOpen) {
                const token = localStorage.getItem("token");

                                const response = await fetch(
                    `${import.meta.env.VITE_API}/todosroles/carrito/obtener/${userId}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }

                const carritoData = await response.json();


                const detallesCarrito = carritoData.detalles || [];
                const productosConDetalles = await Promise.all(
                    detallesCarrito.map(async (item) => {
                        try {
                            const productoResponse = await fetch(
                                `${import.meta.env.VITE_API}/todosroles/Productos/Buscar/${item.idProducto}`,
                                {
                                    method: "GET",
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                        "Content-Type": "application/json",
                                    },
                                }
                            );

                            if (!productoResponse.ok) {
                                throw new Error(`Error al obtener producto ${item.idProducto}`);
                            }

                            const productoData = await productoResponse.json();

                            return {
                                ...item,
                                nombre: productoData.nombre,
                                imageUrl: productoData.imgUrl,
                            };
                        } catch (error) {
                            console.error(`Error al obtener detalles del producto ${item.idProducto}:`, error);
                            return item;
                        }
                    })
                );
                setCartItems(productosConDetalles);
            }

            setIsCartOpen(!isCartOpen);
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <header className={isDarkMode ? "dark-mode" : ""}>
            {isLoading && <Loading message="Cargando carrito, por favor espera..." />}
            {isLoading1 && <Loading message="Eliminando Productos, por favor espera..." />}
            {isLoading2 && <Loading message="Eliminando Producto, por favor espera..." />}
            <nav className="navbar">
                <div className="navbar-container">
                    <button className="hamburger" onClick={toggleMenu}>
                        <FaBars className="icon" />
                    </button>

                    <div className={`nav-menu ${isOpen ? "open" : ""}`}>
                        <button className="nav-item" onClick={toggleTheme}>
                            {isDarkMode ? (
                                <FaSun className="icon" title="Cambiar a Tema Claro" />
                            ) : (
                                <FaMoon className="icon" title="Cambiar a Tema Oscuro" />
                            )}
                        </button>
                        <NavLink style={{ fontSize: '20px' }} to="/Home" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
                            Inicio
                        </NavLink>
                        <NavLink
                            style={{ fontSize: '20px' }}
                            to="/Catalogo"
                            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
                        >
                            Catálogo
                        </NavLink>
                        <div className="nav-item logo-container">
                            <Link to="/Home" className="company-link">
                                <span className="company-name">SIRENAH</span>
                            </Link>
                        </div>
                        <NavLink
                            style={{ fontSize: '20px' }}
                            to="/Nosotros"
                            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
                        >
                            Nosotros
                        </NavLink>
                        <NavLink
                            style={{ fontSize: '20px' }}
                            to="/Contacto"
                            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
                        >
                            Contacto
                        </NavLink>
                        <button className="nav-item" onClick={toggleCartModal}>
                            <FaShoppingCart className="icon" title="Carrito de Compras" />
                            {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
                        </button>
                        <button onClick={PerfilClick} className="nav-item" title="Cuenta">
                            <FaUser className="icon" />
                        </button>
                    </div>
                </div>
            </nav>
            {isCartOpen && (
                <div className={`cart-modal ${isCartOpen ? "open" : ""}`}>
                    <div className="cart-modal-content">
                        <button className="close-modal" onClick={() => setIsCartOpen(false)}>
                            &times;
                        </button>
                        <h2>Carrito de Compras</h2>
                        {cartItems.length > 0 ? (
                            <ul>
                                {cartItems.map((item, index) => (
                                    <li key={index}>
                                        <img src={item.imageUrl} alt={`Imagen de ${item.nombre}`} />
                                        <div className="product-details">
                                            <h4>{item.nombre}</h4>
                                            <p>Subtotal: S/. {item.subtotal.toFixed(2)}</p>
                                        </div>
                                        <div className="quantity-controls">
                                            <button onClick={() => disminuirProductoCarrito(item.idProducto, item.idCarritoDetalle, setIsLoading2, setCartItems)}>-</button>
                                            <span>{item.cantidad}</span>
                                            <button onClick={() => aumentarProductoCarrito(item.idProducto,setCartItems)}>+</button>

                                        </div>
                                        <button
                                            className="remove-product-btn"
                                            onClick={() => eliminarProductoDelCarrito(item.idCarritoDetalle, setIsLoading2, setCartItems)}
                                            title="Eliminar producto"
                                        >
                                            <FaTrash className="icon" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>Tu carrito está vacío.</p>
                        )}
                        <div className="cart-summary">
                            <p>
                                Total: <span>${cartItems.reduce((acc, item) => acc + item.subtotal, 0).toFixed(2)}</span>
                            </p>
                        </div>
                        <div className="cart-actions">
                            <button onClick={() => vaciarCarrito(setIsLoading1,setCartItems)}
                                className="clear-cart">Vaciar Carrito</button>
                            <button onClick={() => navigate("/MenuCliente/Carrito")}>Realizar Compra</button>
                        </div>
                        
                    </div>
                </div>
            )}

        </header>
    );
};

export default Header;
