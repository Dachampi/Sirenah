import { AlertaDeEliminacion, AlertaDeExito } from "../../utils/Alertas.js";
import { obtenerUsuarioId } from "../todosroles.js";

export const eliminarProductoDelCarrito = async (idCarritoDetalle, setIsLoading, setCartItems) => {
    setIsLoading(true);
    try {
        const userId = await obtenerUsuarioId();
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Token de autenticación no disponible.");
            setIsLoading(false);
            return;
        }

        const confirmacion = await AlertaDeEliminacion("¿Estás seguro de eliminar este producto?", "");

        if (!confirmacion.isConfirmed) {
            setIsLoading(false);
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

        const response = await fetch(
            `${import.meta.env.VITE_API}/todosroles/carrito/${carritoData.idCarrito}/detalle/${idCarritoDetalle}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Error al eliminar el producto: ${response.statusText}`);
        }
        setCartItems(prevCartItems => prevCartItems.filter(item => item.idCarritoDetalle !== idCarritoDetalle));
        AlertaDeExito("¡Éxito!", "Producto Eliminado Correctamente.");
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        AlertaDeEliminacion("Error", "Error al eliminar el producto.");
    } finally {
        setIsLoading(false);
    }
};

export const eliminarProductosCarrito = async (idCarritoDetalle ,setCartItems) => {
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


        const response = await fetch(
            `${import.meta.env.VITE_API}/todosroles/carrito/${carritoData.idCarrito}/detalle/${idCarritoDetalle}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        if (!response.ok) {
            throw new Error(`Error al eliminar el producto: ${response.statusText}`);
        }
        setCartItems(prevCartItems => prevCartItems.filter(item => item.idCarritoDetalle !== idCarritoDetalle));
            } catch (error) {
        AlertaDeEliminacion("Error", "Error al eliminar el producto")
    }
};
