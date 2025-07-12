import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API}/admin`;
const token = localStorage.getItem("token");

// Interceptor para agregar el token a cada solicitud
axios.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 1. Reporte de Ventas por fecha
export const obtenerReporteVentas = async (desde, hasta) => {
  const response = await axios.get(`${BASE_URL}/reportes/ventas`, {
    params: { desde, hasta },
  });
  return response.data;
};

// 2. Ingresos agrupados por día, mes o año
export const obtenerIngresos = async (tipo, desde, hasta) => {
  const response = await axios.get(`${BASE_URL}/reportes/ingresos`, {
    params: { tipo, desde, hasta },
  });
  return response.data;
};

// 3. Productos más vendidos
export const obtenerProductosMasVendidos = async (tipo) => {
  const response = await axios.get(`${BASE_URL}/reportes/productos-mas-vendidos`, {
    params: { tipo },
  });
  return response.data;
};

// 4. Productos con bajo stock
export const obtenerProductosConBajoStock = async () => {
  const response = await axios.get(`${BASE_URL}/reportes/inventario/bajo-stock`);
  return response.data;
};

// 5. Valor total del inventario
export const obtenerValorTotalInventario = async () => {
  const response = await axios.get(`${BASE_URL}/reportes/inventario/valor-total`);
  return response.data;
};

// 6. Comparativo de ventas entre periodos
export const obtenerComparativoVentas = async (tipo, periodoA, periodoB) => {
  const response = await axios.get(`${BASE_URL}/reportes/ventas/comparativo-ventas`, {
    params: { tipo, periodoA, periodoB },
  });
  return response.data;
};

// 7. Crecimiento mensual de ventas
export const obtenerCrecimientoMensual = async (desde, hasta) => {
  const response = await axios.get(`${BASE_URL}/reportes/ventas/crecimiento-mensual`, {
    params: { desde, hasta },
  });
  return response.data;
};
