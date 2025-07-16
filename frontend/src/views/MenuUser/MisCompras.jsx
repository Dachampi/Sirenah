"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  CreditCard,
  Download,
  ShoppingBag,
  DollarSign,
  Info,
  Banknote,
  ReceiptText,
} from "lucide-react";
import UserSidebar from "../../components/layout/UserSidebar";
import MiniProfileUser from "../../components/common/MiniProfileUser";
import { obtenerUsuarioId } from "../../services/todosroles";
import Loading from "../../components/common/Loanding";
import CompraDetalleModal from "./CompraDetalleModal";
import "../../styles/stylesAdm/ATablas.css";
import "../../styles/stylesUser/MisCompras.css";
import jsPDF from "jspdf"; // Importar jsPDF aquí

// Helper para mapear tipos de pago a texto amigable
const mapPaymentType = (type) => {
  switch (type.toLowerCase()) {
    case "credit_card":
      return "Tarjeta de Crédito";
    case "account_money":
      return "Dinero en Cuenta (Mercado Pago)";
    case "transferencia":
      return "Transferencia Bancaria";
    case "pago_efectivo":
      return "Pago en Efectivo";
    case "tarjeta_debito":
      return "Tarjeta de Débito";
    case "deposito_pago_efectivo":
      return "Depósito Pago Efectivo";
    default:
      return type.replace(/_/g, " ");
  }
};

const getPaymentMethodDetails = (tipo) => {
  const baseType = mapPaymentType(tipo);
  if (tipo.toLowerCase() === "credit_card") {
    return `${baseType} (Visa)`;
  }
  return baseType;
};

const getTipoIcon = (tipo) => {
  switch (tipo.toLowerCase()) {
    case "credit_card":
      return <CreditCard size={16} />;
    case "account_money":
      return <DollarSign size={16} />;
    case "transferencia":
      return <Banknote size={16} />;
    case "pago_efectivo":
      return <ReceiptText size={16} />;
    case "tarjeta_debito":
      return <CreditCard size={16} />;
    case "deposito_pago_efectivo":
      return <Banknote size={16} />;
    default:
      return <Info size={16} />;
  }
};
const traducirEstadoDisplay = (estado) => {
  switch (estado?.toLowerCase()) {
    case "approved":
      return "Aprobado";
    case "pending":
      return "Pendiente";
    case "rejected":
      return "Rechazado";
    case "in_process":
      return "En Proceso";
    case "cancelled":
      return "Cancelado";
    case "refunded":
      return "Reembolsado";
    default:
      return estado; // Si no hay traducción, devuelve el estado original
  }
};
function MisCompras() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pagos, setPagos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [compraSeleccionada, setCompraSeleccionada] = useState(null);

  const handleCollapseChange = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  const abrirDetalles = (pago) => {
    setCompraSeleccionada(pago);
  };

  const cerrarDetalles = () => {
    setCompraSeleccionada(null);
  };

  // Lógica de descarga de boleta mejorada
  const descargarBoleta = async (idPago) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token de autenticación no disponible.");
      }

      // Obtener los detalles del pago por su ID
      const responsePago = await fetch(
        `${
          import.meta.env.VITE_API
        }/todosroles/MercadoPago/ObtenerPorId/${idPago}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!responsePago.ok) {
        throw new Error("Error al obtener los detalles del pago");
      }
      const pago = await responsePago.json();

      // Obtener datos del cliente
      const responseCliente = await fetch(
        `${import.meta.env.VITE_API}/todosroles/datosPorId/${
          pago.pedido.idCliente
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!responseCliente.ok) {
        throw new Error("Error al obtener datos del cliente");
      }
      const clienteDatos = await responseCliente.json();

      const { tipo, idTransaccion, moneda, fechaPago, estado, pedido, total } =
        pago;
      const IGV_RATE = 0.18; // 18% para Perú
      const subtotalSinIGV = total / (1 + IGV_RATE);
      const igvMonto = total - subtotalSinIGV;

      const empresa = {
        nombre: "Sirenah S.A.C.",
        ruc: "20123456789",
        direccion: "Urb. Sol de Huacachina H-4, Ica, Perú 1101",
        telefono: "(+51) 930 462 483",
        email: "contacto@sirenah.com",
        web: "https://sirenah-production-e1b8.up.railway.app",
        ciudad: "Ica - Perú",
        puntoEmision: "Tienda Virtual",
        ubigeo: "110101 - Ica, Ica, Ica",
      };

      const pdf = new jsPDF();
      let yPosition = 15;
      const margin = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const lineHeight = 5;

      // Función para dibujar línea divisoria
      const drawLine = () => {
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 5;
      };

      // Función para centrar texto
      const centerText = (text, y) => {
        pdf.text(text, pageWidth / 2, y, null, null, "center");
      };

      // --- Denominación del Documento y Fecha de Emisión ---
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      centerText("BOLETA DE VENTA ELECTRÓNICA", yPosition);
      yPosition += 8;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      centerText(
        `Fecha de Emisión: ${new Date(fechaPago).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}`,
        yPosition
      );
      // --- 1. Encabezado de la Empresa ---
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      yPosition += lineHeight;
      centerText(`${empresa.nombre} (RUC: ${empresa.ruc})`, yPosition);
      yPosition += lineHeight;
      centerText(empresa.direccion, yPosition);
      yPosition += lineHeight;
      centerText(
        `Tel: ${empresa.telefono} | Email: ${empresa.email}`,
        yPosition
      );
      yPosition += lineHeight;
      centerText(`Web: ${empresa.web} | ${empresa.ciudad}`, yPosition);
      yPosition += lineHeight;
      drawLine();
      yPosition += 5;

      // --- 2. Datos del Cliente ---
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("DATOS DEL CLIENTE", margin, yPosition);
      yPosition += 5;
      yPosition += 5;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(
        `Nombre: ${clienteDatos.nombre} ${clienteDatos.apellido}`,
        margin,
        yPosition
      );
      yPosition += lineHeight;
      pdf.text(`DNI: ${clienteDatos.dni}`, margin, yPosition);
      yPosition += lineHeight;
      pdf.text(`Email: ${clienteDatos.email}`, margin, yPosition);
      yPosition += lineHeight;
      pdf.text(`Teléfono: ${clienteDatos.telefono}`, margin, yPosition);
      yPosition += lineHeight;
      pdf.text(`Dirección de Entrega: ${pedido.direccion}`, margin, yPosition);
      yPosition += 5;
      drawLine();
      yPosition += 5;

      // --- 3. Detalle de la Venta (Tabla de Productos) ---
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("DETALLE DE LA VENTA", margin, yPosition);
      yPosition += 5;
      yPosition += 5;

      // Cabecera de la tabla
      pdf.setFont("helvetica", "bold");
      pdf.setFillColor(240, 240, 240); // Gris muy claro para la cabecera
      pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, "FD");
      pdf.text("Cant.", margin + 2, yPosition + 5);
      pdf.text("Descripción del Producto", margin + 20, yPosition + 5);
      pdf.text(
        "P. Unit.",
        pageWidth - margin - 50,
        yPosition + 5,
        null,
        null,
        "right"
      );
      pdf.text(
        "Subtotal",
        pageWidth - margin - 5,
        yPosition + 5,
        null,
        null,
        "right"
      );
      yPosition += 8;

      // Detalles de los productos
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pedido.detalles.forEach((detalle) => {
        if (yPosition > 260) {
          pdf.addPage();
          yPosition = 15;
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(12);
          pdf.text("DETALLE DE LA VENTA (Continuación)", margin, yPosition);
          yPosition += 5;
          drawLine();
          yPosition += 5;
          pdf.setFont("helvetica", "bold");
          pdf.setFillColor(240, 240, 240);
          pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, "FD");
          pdf.text("Cant.", margin + 2, yPosition + 5);
          pdf.text("Descripción del Producto", margin + 20, yPosition + 5);
          pdf.text(
            "P. Unit.",
            pageWidth - margin - 50,
            yPosition + 5,
            null,
            null,
            "right"
          );
          pdf.text(
            "Subtotal",
            pageWidth - margin - 5,
            yPosition + 5,
            null,
            null,
            "right"
          );
          yPosition += 8;
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(10);
        }
        pdf.text(detalle.cantidad.toString(), margin + 2, yPosition + 5);
        pdf.text(detalle.nombreProducto, margin + 20, yPosition + 5);
        pdf.text(
          detalle.precioUnitario.toFixed(2),
          pageWidth - margin - 50,
          yPosition + 5,
          null,
          null,
          "right"
        );
        pdf.text(
          detalle.subtotal.toFixed(2),
          pageWidth - margin - 5,
          yPosition + 5,
          null,
          null,
          "right"
        );
        yPosition += 8;
      });
      yPosition += 5; // Espacio después de la tabla
      drawLine();
      yPosition += 5;

      // --- 4. Totales ---
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(
        `Subtotal:`,
        pageWidth - margin - 60,
        yPosition,
        null,
        null,
        "right"
      );
      pdf.text(
        `${moneda} ${subtotalSinIGV.toFixed(2)}`,
        pageWidth - margin - 5,
        yPosition,
        null,
        null,
        "right"
      );
      yPosition += lineHeight;
      pdf.text(
        `IGV (18%):`,
        pageWidth - margin - 60,
        yPosition,
        null,
        null,
        "right"
      );
      pdf.text(
        `${moneda} ${igvMonto.toFixed(2)}`,
        pageWidth - margin - 5,
        yPosition,
        null,
        null,
        "right"
      );
      yPosition += lineHeight;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text(
        `TOTAL A PAGAR:`,
        pageWidth - margin - 60,
        yPosition,
        null,
        null,
        "right"
      );
      pdf.text(
        `${moneda} ${total.toFixed(2)}`,
        pageWidth - margin - 5,
        yPosition,
        null,
        null,
        "right"
      );
      yPosition += 5;
      drawLine();
      yPosition += 5;

      // --- 5. Medio de Pago ---
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("MEDIO DE PAGO", margin, yPosition);
      yPosition += 5;
      yPosition += 5;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(
        `Método de Pago: ${getPaymentMethodDetails(tipo)}`,
        margin,
        yPosition
      );
      yPosition += lineHeight;
      pdf.text(`Estado del Pago: ${estado}`, margin, yPosition);
      yPosition += lineHeight;
      pdf.text(
        `Fecha de Pago: ${new Date(fechaPago).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}`,
        margin,
        yPosition
      );
      yPosition += lineHeight;
      pdf.text(`ID de Transacción: ${idTransaccion}`, margin, yPosition);
      yPosition += 5;
      drawLine();
      yPosition += 5;

      // --- 8. Información Adicional ---
      pdf.text(
        "Gracias por su compra. Para más información sobre cambios y devoluciones,",
        margin,
        yPosition
      );
      yPosition += lineHeight;
      pdf.text("visite nuestro sitio web oficial.", margin, yPosition);
      yPosition += 10;

      // Código QR (Placeholder)
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(10);
      pdf.text("Código QR:", margin, yPosition);
      pdf.rect(margin, yPosition + 5, 30, 30); // Cuadrado para simular QR
      pdf.text("QR", margin + 15, yPosition + 20, null, null, "center");
      yPosition += 40;
      drawLine();
      yPosition += 5;

      // Pie de página (Copyright)
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      centerText(
        `© ${new Date().getFullYear()} ${
          empresa.nombre
        } | Todos los derechos reservados`,
        yPosition
      );

      // Descargar el archivo PDF
      pdf.save(`Boleta_Venta_${idPago}.pdf`);
    } catch (error) {
      console.error("Error al descargar la boleta:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEstadoClass = (estado) => {
    switch (estado.toLowerCase()) {
      case "approved":
        return "compra-estado-approved";
      case "pending":
        return "compra-estado-pending";
      case "rejected":
        return "compra-estado-rejected";
      default:
        return "compra-estado-default";
    }
  };

  const pagosFiltrados = pagos.filter((pago) => {
    const estadoMatch =
      filtroEstado === "todos" || pago.estado.toLowerCase() === filtroEstado;
    const tipoMatch =
      filtroTipo === "todos" || pago.tipo.toLowerCase() === filtroTipo;
    return estadoMatch && tipoMatch;
  });

  useEffect(() => {
    const fetchUsuarioId = async () => {
      try {
        const id = await obtenerUsuarioId();
        setUsuarioId(id);
      } catch (error) {
        console.error("Error al obtener el ID de usuario:", error);
      }
    };
    fetchUsuarioId();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (usuarioId) {
      const obtenerPagos = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Token de autenticación no disponible.");
          }
          const response = await fetch(
            `${
              import.meta.env.VITE_API
            }/todosroles/MercadoPago/ObtenerPorCliente/${usuarioId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!response.ok) {
            throw new Error("Error al obtener los pagos");
          }
          const data = await response.json();
          setPagos(data);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          setIsLoading(false);
        }
      };
      obtenerPagos();
    }
  }, [usuarioId]);

  return (
    <div className="Admin-layout">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "10px 20px",
        }}
      >
        <MiniProfileUser />
      </div>
      <UserSidebar onCollapseChange={handleCollapseChange} />
      <main
        style={{ marginTop: "0px" }}
        className={`content ${isCollapsed ? "collapsed" : ""}`}
      >
        <div className="compra-header-section">
          <div className="compra-title-container">
            <ShoppingBag className="compra-title-icon" />
            <h1 className="compra-title">Mis Compras</h1>
          </div>
          <p className="compra-subtitle">
            Revisa el historial de tus pagos y descarga tus boletas.
          </p>
        </div>

        <div className="compra-filters-container">
          <div className="compra-filter-group">
            <label className="compra-filter-label">Filtrar por estado:</label>
            <select
              className="compra-filter-select"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="approved">Aprobados</option>
              <option value="pending">Pendientes</option>
              <option value="rejected">Rechazados</option>
            </select>
          </div>
          <div className="compra-filter-group">
            <label className="compra-filter-label">Filtrar por tipo:</label>
            <select
              className="compra-filter-select"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="todos">Todos los tipos</option>
              <option value="credit_card">Tarjeta de Crédito</option>
              <option value="tarjeta_debito">Tarjeta de Débito</option>
              <option value="account_money">Dinero en Cuenta</option>
              <option value="transferencia">Transferencia Bancaria</option>
              <option value="pago_efectivo">Pago en Efectivo</option>
              <option value="deposito_pago_efectivo">
                Depósito Pago Efectivo
              </option>
            </select>
          </div>
          <div className="compra-stats">
            <span className="compra-total-count">
              {pagosFiltrados.length}{" "}
              {pagosFiltrados.length === 1 ? "compra" : "compras"}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="compra-loading-container">
            <Loading />
          </div>
        ) : (
          <div className="compra-content-container">
            {pagosFiltrados.length === 0 ? (
              <div className="compra-empty-state">
                <ShoppingBag className="compra-empty-icon" />
                <h3 className="compra-empty-title">
                  {filtroEstado === "todos" && filtroTipo === "todos"
                    ? "No tienes compras realizadas"
                    : "No se encontraron compras con los filtros aplicados"}
                </h3>
                <p className="compra-empty-description">
                  {filtroEstado === "todos" && filtroTipo === "todos"
                    ? "Cuando realices tu primera compra, aparecerá aquí."
                    : "Prueba cambiando los filtros para ver otros resultados."}
                </p>
              </div>
            ) : (
              <div className="compra-grid-container">
                {pagosFiltrados.map((pago) => (
                  <div key={pago.idPago} className="compra-card">
                    <div className="compra-card-header">
                      <div className="compra-id-transaccion">
                        <span className="compra-label">ID Transacción:</span>
                        <span className="compra-value">
                          {pago.idTransaccion}
                        </span>
                      </div>
                      <div
                        className={`compra-estado-badge ${getEstadoClass(
                          pago.estado
                        )}`}
                      >
                        {traducirEstadoDisplay(pago.estado)}
                      </div>
                    </div>
                    <div className="compra-card-body">
                      <div className="compra-info-item">
                        <Calendar className="compra-info-icon" />
                        <div className="compra-info-content">
                          <span className="compra-label">Fecha de Pago:</span>
                          <span className="compra-value">
                            {new Date(pago.fechaPago).toLocaleDateString(
                              "es-ES",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="compra-info-item">
                        {getTipoIcon(pago.tipo)}
                        <div className="compra-info-content">
                          <span className="compra-label">Tipo de Pago:</span>
                          <span className="compra-value">
                            {mapPaymentType(pago.tipo)}
                          </span>
                        </div>
                      </div>
                      <div className="compra-info-item compra-total-amount">
                        <DollarSign className="compra-info-icon" />
                        <div className="compra-info-content">
                          <span className="compra-label">Total:</span>
                          <span className="compra-value">
                            {pago.total.toFixed(2)} {pago.moneda}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="compra-card-footer">
                      <button
                        className="compra-details-button"
                        onClick={() => abrirDetalles(pago)}
                      >
                        Ver Detalles
                      </button>
                      <button
                        className="compra-download-button"
                        onClick={() => descargarBoleta(pago.idPago)}
                      >
                        <Download size={16} />
                        Boleta
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {compraSeleccionada && (
          <CompraDetalleModal
            pago={compraSeleccionada}
            onClose={cerrarDetalles}
          />
        )}
      </main>
    </div>
  );
}

export default MisCompras;
