import { useNavigate } from "react-router-dom";
import "../../styles/stylesPagos/Success.css";
import { useEffect, useState } from "react";
import Loading from "../../components/common/Loanding.jsx";
import { AlertaDeError } from "../../utils/Alertas.js";
import jsPDF from "jspdf";

function Success() {
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const query = new URLSearchParams(window.location.search);
    
    const idTransaccion = query.get("payment_id") || localStorage.getItem("idPago");

    if (!idTransaccion) {

      AlertaDeError("¡Error!", "No se encontró un ID de pago.");
      return;
    }

    const fetchPaymentDetails = async () => {
      try {
        const [paymentRes, paymentErr] = await fetch(
          `${import.meta.env.VITE_API}/todosroles/Pago/ObtenerPorTransaccion/${idTransaccion}`,

          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ).then(async (res) => [await res.json(), res.ok]);

        if (!paymentErr) throw new Error("Error al obtener detalles del pago");

        setPaymentDetails(paymentRes);

        const [clientRes, clientErr] = await fetch(
          `${import.meta.env.VITE_API}/todosroles/datosPorId/${
            paymentRes.pedido.idCliente
          }`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        ).then(async (res) => [await res.json(), res.ok]);

        if (!clientErr) throw new Error("Error al obtener datos del cliente");

        setClientData(clientRes);
      } catch (err) {
        AlertaDeError("¡Error!", err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, []);

  const handleBackToMenu = () => {
    localStorage.removeItem("idPago");
    navigate("/MenuCliente/MisCompras");
  };

  const handleDownloadReceipt = () => {
    if (!paymentDetails || !clientData) return;

    const { idPago, tipo, idTransaccion, moneda, fechaPago, estado, pedido } =
      paymentDetails;

    const { nombre, apellido, email, telefono, dni } = clientData;

    const empresa = {
      nombre: "Sirenah",
      direccion: "Urb. Sol de Huacachina H-4, Ica, Peru 1101",
      telefono: "(+51) 930 462 483",
      email: "contacto@sirenah.com",
    };

    const pdf = new jsPDF();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("Boleta de Pago", 105, 20, null, null, "center");

    // Empresa
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
    let y = 30;
    pdf.text(empresa.nombre, 20, y);
    y += 8;
    pdf.text(empresa.direccion, 20, y);
    y += 8;
    pdf.text(`Tel: ${empresa.telefono}`, 20, y);
    y += 8;
    pdf.text(`Email: ${empresa.email}`, 20, y);
    y += 12;

    pdf.setLineWidth(0.5);
    pdf.line(20, y, 190, y);
    y += 8;

    // Información de pago
    pdf.text(`ID Transacción: ${idTransaccion}`, 20, y);
    y += 8;
    pdf.text(`Tipo de Pago: ${tipo}`, 20, y);
    y += 8;
    pdf.text(`Moneda: ${moneda}`, 20, y);
    y += 8;
    pdf.text(`Fecha de Pago: ${new Date(fechaPago).toLocaleString()}`, 20, y);
    y += 8;
    pdf.text(`Estado: ${estado}`, 20, y);
    y += 8;

    pdf.line(20, y, 190, y);
    y += 8;

    // Cliente
    pdf.setFont("helvetica", "bold");
    pdf.text("Datos del Cliente:", 20, y);
    y += 10;
    pdf.setFont("helvetica", "normal");
    pdf.text(`Nombre: ${nombre} ${apellido}`, 20, y);
    y += 8;
    pdf.text(`DNI: ${dni}`, 20, y);
    y += 8;
    pdf.text(`Email: ${email}`, 20, y);
    y += 8;
    pdf.text(`Teléfono: ${telefono}`, 20, y);
    y += 12;

    // Pedido
    pdf.setFont("helvetica", "bold");
    pdf.text("Detalles del Pedido:", 20, y);
    y += 10;
    pdf.setFont("helvetica", "normal");
    pdf.text(`Dirección: ${pedido.direccion}`, 20, y);
    y += 8;
    pdf.text(
      `Fecha del Pedido: ${new Date(pedido.fechaPedido).toLocaleString()}`,
      20,
      y
    );
    y += 12;

    // Tabla de productos
    pdf.setFont("helvetica", "bold");
    pdf.text("Productos:", 20, y);
    y += 10;

    pdf.setFillColor(200, 220, 255);
    pdf.rect(20, y, 170, 10, "FD");
    pdf.text("Producto", 22, y + 6);
    pdf.text("Cantidad", 90, y + 6);
    pdf.text("Precio Unitario", 120, y + 6);
    pdf.text("Subtotal", 160, y + 6);
    y += 18;

    let total = 0;
    pedido.detalles.forEach((d) => {
      if (y > 270) {
        // salto de página
        pdf.addPage();
        y = 20;
      }
      pdf.text(d.nombreProducto, 20, y);
      pdf.text(d.cantidad.toString(), 90, y);
      pdf.text(d.precioUnitario.toFixed(2), 120, y);
      pdf.text(d.subtotal.toFixed(2), 160, y);
      total += d.subtotal;
      y += 8;
    });

    pdf.line(20, y, 190, y);
    y += 10;

    pdf.setFont("helvetica", "bold");
    pdf.text("Total de la Compra:", 20, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${total.toFixed(2)} ${moneda}`, 160, y, null, null, "right");

    pdf.save(`Boleta_Pago_${idPago}.pdf`);
  };

  if (loading) {
    return (
      <div className="success-container">
        <Loading message="Obteniendo Detalles, por favor espera..." />
      </div>
    );
  }

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.93 10.933L4.44 8.44a.5.5 0 0 0-.708 0l-.708.708a.5.5 0 0 0 0 .708l3 3a.5.5 0 0 0 .707 0l8-8a.5.5 0 0 0 0-.707l-.707-.708a.5.5 0 0 0-.708 0L6.93 10.933z" />
          </svg>
        </div>
        <h1 className="success-title">¡Transacción Exitosa!</h1>
        <p className="success-message">
          Tu pago se ha procesado correctamente. Gracias por confiar en
          nosotros. A continuación, puedes ver los detalles de tu transacción.
        </p>
        <div className="success-details">
          <p>
            <strong>ID de la transacción:</strong>{" "}
            {paymentDetails.idTransaccion}
          </p>
          <p>
            <strong>Monto:</strong> {paymentDetails.total} PEN
          </p>
          <p>
            <strong>Fecha:</strong>{" "}
            {new Date(paymentDetails.fechaPago).toLocaleDateString()}
          </p>
        </div>
        <div className="success-actions">
          <button className="success-button" onClick={handleDownloadReceipt}>
            Descargar Comprobante
          </button>
          <button className="success-button" onClick={handleBackToMenu}>
            Volver al Menú
          </button>
        </div>
      </div>
    </div>
  );
}

export default Success;
