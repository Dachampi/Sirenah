import { AlertaDeError } from "../../utils/Alertas.js";
import { obtenerUsuarioId } from "../todosroles.js";
import { eliminarProductoDelCarrito } from "./DeleteProductoCarrito.js";

export const aumentarProductoCarrito = async (idProducto , setCartItems) => {
    try {
        const userId = await obtenerUsuarioId();
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Token de autenticación no disponible.");
            return;
        }

                const idCarrito = await fetch(
            `${import.meta.env.VITE_API}/todosroles/carrito/obtener/${userId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!idCarrito.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const carritoData = await idCarrito.json();


        const response = await fetch(`${import.meta.env.VITE_API}/todosroles/carrito/${carritoData.idCarrito}/detalle/aumentar?idProducto=${idProducto}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const updatedDetalle = await response.json();
        setCartItems((prevCartItems) =>
            prevCartItems.map((item) =>
                item.idProducto === idProducto ? { ...item, cantidad: updatedDetalle.cantidad, subtotal: updatedDetalle.subtotal } : item
            )
        );
    } catch (error) {
        console.error("Error al aumentar la cantidad del producto:", error);
        AlertaDeError("Error","Error al aumentar la cantidad del producto")
    }
};

export const disminuirProductoCarrito = async (idProducto, idCarritoDetalle, setIsLoading, setCartItems) => {
    try {
        const userId = await obtenerUsuarioId();
        const token = localStorage.getItem("token");
        if (!token) {
            AlertaDeError("Error","Token de autenticación no disponible.");
            return;
        }

                const idCarrito = await fetch(
            `${import.meta.env.VITE_API}/todosroles/carrito/obtener/${userId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!idCarrito.ok) {
            throw new Error(`Error ${idCarrito.status}: ${idCarrito.statusText}`);
        }

        const carritoData = await idCarrito.json();

                const producto = carritoData.detalles.find(item => item.idProducto === idProducto);

        if (!producto) {
            alert("Producto no encontrado en el carrito.");
            return;
        }

        if (producto.cantidad > 1) {

            const response = await fetch(
                `${import.meta.env.VITE_API}/todosroles/carrito/${carritoData.idCarrito}/detalle/disminuir?idProducto=${idProducto}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Error al disminuir producto: ${response.statusText}`);
            }

            const updatedDetalle = await response.json();
            setCartItems(prevCartItems =>
                prevCartItems.map(item =>
                    item.idProducto === idProducto ? { ...item, cantidad: updatedDetalle.cantidad, subtotal: updatedDetalle.subtotal } : item
                )
            );
        } else {
            await eliminarProductoDelCarrito(idCarritoDetalle,setIsLoading, setCartItems);
        }

    } catch (error) {
        console.error("Error al disminuir la cantidad del producto:", error);
    }
};