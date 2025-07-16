import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FileText,
  Download,
  XCircle,
  DollarSign,
  ShoppingCart,
  Clock,
  CheckCircle,
  Info,
  CreditCard,
  Banknote,
  ReceiptText,
  CircleDotDashed,
} from "lucide-react";
import AdminSidebar from "../../components/layout/AdminSidebar";
import MiniProfile from "../../components/common/MiniProfile.jsx";
import { VentaDetalleModal } from "./VentaDetalleModal";
import "../../styles/stylesAdm/AVentas.css";

const mapPaymentType = (type) => {
  switch (type?.toLowerCase()) {
    case "credit_card":
      return "Tarjeta de Crédito";
    case "account_money":
      return "Dinero en Cuenta (Mercado Pago)";
    case "transferencia":
      return "Transferencia Bancaria";
    case "pago_efectivo":
      return "Pago en Efectivo";
    case "debit_card":
      return "Tarjeta de Débito";
    case "deposito_pago_efectivo":
      return "Depósito Pago Efectivo";
    default:
      return type ? type.replace(/_/g, " ") : "N/A";
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
      return estado || "Desconocido";
  }
};

const getTipoIcon = (tipo) => {
  switch (tipo?.toLowerCase()) {
    case "credit_card":
      return <CreditCard size={16} className="mr-1" />;
    case "account_money":
      return <DollarSign size={16} className="mr-1" />;
    case "transferencia":
      return <Banknote size={16} className="mr-1" />;
    case "pago_efectivo":
      return <ReceiptText size={16} className="mr-1" />;
    case "debit_card":
      return <CreditCard size={16} className="mr-1" />;
    case "deposito_pago_efectivo":
      return <Banknote size={16} className="mr-1" />;
    default:
      return <CircleDotDashed size={16} className="mr-1" />;
  }
};


const getEstadoClass = (estado) => {
  switch (estado?.toLowerCase()) {
    case "approved":
      return "ventas-container-status-approved";
    case "pending":
      return "ventas-container-status-pending";
    case "rejected":
      return "ventas-container-status-rejected";
    case "in_process":
      return "ventas-container-status-in_process";
    case "cancelled":
      return "ventas-container-status-cancelled";
    case "refunded":
      return "ventas-container-status-refunded";
    default:
      return "ventas-container-status-default";
  }
};

export default function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedVenta, setSelectedVenta] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerVentas = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token de autenticación no disponible.");
        }
        // Using import.meta.env.VITE_API for Vite environment variables
        const response = await fetch(
          `${import.meta.env.VITE_API}/todosroles/MercadoPago/Obtener`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Error al obtener las ventas");
        }
        const data = await response.json();
        setVentas(data);
      } catch (error) {
        console.error("Error:", error);
        setError(
          "No se pudieron cargar las ventas. Inténtalo de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };
    obtenerVentas();
  }, []);

  const handleViewDetails = async (ventaId) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token de autenticación no disponible.");
      }
      const responsePago = await fetch(
        `${
          import.meta.env.VITE_API
        }/todosroles/MercadoPago/ObtenerPorId/${ventaId}`,
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

      setSelectedVenta({ ...pago, cliente: clienteDatos });
      setShowDetailModal(true);
    } catch (error) {
      console.error("Error al cargar detalles de la venta:", error);
      setError("No se pudieron cargar los detalles de la venta.");
    } finally {
      setIsLoading(false);
    }
  };

  const descargarBoleta = async (idPago, motivoDescarga) => {
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
      pdf.text(`Método de Pago: ${mapPaymentType(tipo)}`, margin, yPosition);
      yPosition += lineHeight;
      pdf.text(
        `Estado del Pago: ${traducirEstadoDisplay(estado)}`,
        margin,
        yPosition
      );
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
      // --- 8. Motivo de la Descarga ---
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("MOTIVO DE DESCARGA", margin, yPosition);
      yPosition += 5;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      const lineas = pdf.splitTextToSize(
        motivoDescarga,
        pageWidth - 2 * margin
      );
      lineas.forEach((l) => {
        pdf.text(l, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += 5;
      drawLine();
      yPosition += 5;

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

  const [isCollapsed, setIsCollapsed] = useState(false);
  const handleCollapseChange = (collapsed) => {
    setIsCollapsed(collapsed);
  };

  // Calcular métricas para las tarjetas de resumen
  const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0);
  const totalTransacciones = ventas.length;
  const ventasAprobadas = ventas.filter(
    (venta) => venta.estado.toLowerCase() === "approved"
  ).length;
  const ventasPendientes = ventas.filter(
    (venta) => venta.estado.toLowerCase() === "pending"
  ).length;

  const exportarVentasPDF = () => {
    if (ventas.length === 0) {
      alert("No hay ventas para exportar.");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });
    const fechaActual = new Date().toLocaleDateString("es-PE");

    doc.setFontSize(14);
    doc.text("Reporte de Ventas", 14, 15);
    doc.setFontSize(10);
    doc.text(`Fecha de exportación: ${fechaActual}`, 14, 22);

    const columnas = [
      { header: "ID Transacción", dataKey: "id" },
      { header: "Cliente", dataKey: "cliente" },
      { header: "Fecha", dataKey: "fecha" },
      { header: "Tipo", dataKey: "tipo" },
      { header: "Estado", dataKey: "estado" },
      { header: "Total (S/.)", dataKey: "total" },
    ];

    const filas = ventas.map((v) => ({
      id: v.idTransaccion,
      cliente: `${v.cliente?.nombre ?? ""} ${v.cliente?.apellido ?? ""}`,
      fecha: new Date(v.fechaPago).toLocaleString("es-PE"),
      tipo: mapPaymentType(v.tipo),
      estado: traducirEstadoDisplay(v.estado),
      total: v.total.toFixed(2),
    }));

    autoTable(doc, {
      startY: 30,
      head: [columnas.map((c) => c.header)],
      body: filas.map((f) => columnas.map((c) => f[c.dataKey])),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 112, 192], halign: "center" },
      bodyStyles: { halign: "center" },
      margin: { left: 14, right: 14 },
    });

    const totalPDF = ventas.reduce((sum, v) => sum + v.total, 0);
    doc.setFontSize(11);
    doc.text(
      `Total general: S/. ${totalPDF.toFixed(2)}`,
      doc.internal.pageSize.getWidth() - 60,
      doc.lastAutoTable.finalY + 10
    );

    doc.save(`Ventas_${fechaActual.replaceAll("/", "-")}.pdf`);
  };

  const [clientes, setClientes] = useState({});

  useEffect(() => {
    const cargarClientes = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const nuevosClientes = {};

      for (const venta of ventas) {
        const id = venta.pedido.idCliente;
        if (!nuevosClientes[id]) {
          const res = await fetch(
            `${import.meta.env.VITE_API}/todosroles/datosPorId/${id}`,
            { headers }
          );
          if (res.ok) {
            const data = await res.json();
            nuevosClientes[id] = data;
          }
        }
      }

      setClientes(nuevosClientes);
    };

    if (ventas.length > 0) {
      cargarClientes();
    }
  }, [ventas]);

  return (
    <div className="ventas-container-layout">
      <AdminSidebar onCollapseChange={handleCollapseChange} />
      <main
        style={{ marginTop: "0px" }}
        className={`content ${isCollapsed ? "collapsed" : ""}`}
      >
        <div className="ventas-top-bar">
          <MiniProfile />
        </div>
        <div className="ventas-container-header-section">
          <div className="ventas-container-header-title-group">
            <FileText className="ventas-container-header-icon" />
            <h1 className="ventas-container-header-title">Panel de Ventas</h1>
          </div>
          <div className="ventas-container-header-buttons">
            <button
              onClick={exportarVentasPDF}
              className="ventas-container-export-btn"
            >
              <Download size={20} className="mr-2" />
              Exportar Ventas
            </button>
          </div>
        </div>

        {/* Sección de Tarjetas de Resumen */}
        <div className="ventas-container-summary-grid">
          <div className="ventas-container-summary-card">
            <div className="ventas-container-summary-header">
              <h3 className="ventas-container-summary-title">
                Total de Ventas
              </h3>
              <DollarSign className="ventas-container-summary-icon" />
            </div>
            <span className="ventas-container-summary-value">
              S/. {totalVentas.toFixed(2)}
            </span>
            <p className="ventas-container-summary-description">
              Ingresos totales generados
            </p>
          </div>
          <div className="ventas-container-summary-card">
            <div className="ventas-container-summary-header">
              <h3 className="ventas-container-summary-title">Transacciones</h3>
              <ShoppingCart className="ventas-container-summary-icon" />
            </div>
            <span className="ventas-container-summary-value">
              {totalTransacciones}
            </span>
            <p className="ventas-container-summary-description">
              Número total de compras
            </p>
          </div>
          <div className="ventas-container-summary-card">
            <div className="ventas-container-summary-header">
              <h3 className="ventas-container-summary-title">
                Ventas Aprobadas
              </h3>
              <CheckCircle className="ventas-container-summary-icon" />
            </div>
            <span className="ventas-container-summary-value">
              {ventasAprobadas}
            </span>
            <p className="ventas-container-summary-description">
              Pagos completados con éxito
            </p>
          </div>
          <div className="ventas-container-summary-card">
            <div className="ventas-container-summary-header">
              <h3 className="ventas-container-summary-title">
                Ventas Pendientes
              </h3>
              <Clock className="ventas-container-summary-icon" />
            </div>
            <span className="ventas-container-summary-value">
              {ventasPendientes}
            </span>
            <p className="ventas-container-summary-description">
              Transacciones en proceso
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="ventas-container-no-data">
            <ShoppingCart className="ventas-container-empty-icon animate-bounce" />
            <p>Cargando ventas...</p>
          </div>
        ) : error ? (
          <div className="ventas-container-no-data">
            <XCircle className="ventas-container-empty-icon" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="ventas-container-div-table">
            <div className="ventas-container-table-header">
              <h2 className="ventas-container-table-title">
                Historial de Ventas
              </h2>
              <p className="ventas-container-table-description">
                Un listado de todas las transacciones recientes.
              </p>
            </div>
            {ventas.length === 0 ? (
              <div className="ventas-container-no-data">
                <ShoppingCart className="ventas-container-empty-icon" />
                <p>No se encontraron ventas.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="ventas-container-table">
                  <thead>
                    <tr>
                      <th>ID Transacción</th>
                      <th>Cliente</th>
                      <th>Fecha de Pago</th>
                      <th>Tipo de Pago</th>
                      <th>Estado</th>
                      <th style={{ textAlign: "right" }}>Total</th>
                      <th style={{ textAlign: "center" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ventas.map((venta) => (
                      <tr key={venta.idPago}>
                        <td className="font-medium">{venta.idTransaccion}</td>
                        <td>
                          {clientes[venta.pedido.idCliente]?.nombre}{" "}
                          {clientes[venta.pedido.idCliente]?.apellido}
                        </td>

                        <td>
                          {new Date(venta.fechaPago).toLocaleString("es-ES")}
                        </td>
                        <td>
                          <span className="ventas-container-status-badge">
                            {getTipoIcon(venta.tipo)}
                            {mapPaymentType(venta.tipo)}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`ventas-container-status-badge ${getEstadoClass(
                              venta.estado
                            )}`}
                          >
                            {traducirEstadoDisplay(venta.estado)}
                          </span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {venta.total.toFixed(2)} {venta.moneda}
                        </td>
                        <td className="ventas-container-actions-cell">
                          <button
                            onClick={() => handleViewDetails(venta.idPago)}
                            className="ventas-container-details-btn"
                          >
                            <Info size={16} className="mr-1" />
                            Detalles
                          </button>
                          <button
                            onClick={() => {
                              const motivo = window.prompt(
                                "¿Por qué estás descargando la boleta?"
                              );
                              if (motivo?.trim()) {
                                descargarBoleta(venta.idPago, motivo.trim());
                              }
                            }}
                            className="ventas-container-download-btn"
                          >
                            <Download size={16} className="mr-1" />
                            Boleta
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
      <VentaDetalleModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        venta={selectedVenta}
      />
    </div>
  );
}
