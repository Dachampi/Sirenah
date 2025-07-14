import { useEffect, useState } from "react";
import { initMercadoPago } from "@mercadopago/sdk-react";

function MercadoPagoWallet() {
  const [preferenceId, setPreferenceId] = useState(null);
  const publicKey = import.meta.env.VITE_PUBLIC_KEY_MP;
  const createPreferenceIdEndpoint = "";

  useEffect(() => {
    if (!window.MercadoPago) {
      initMercadoPago(publicKey, { locale: "es-PE" });
    } else {
      console.log("Mercado Pago SDK already initialized");
    }
  }, []);

  const createPreferenceIdFromAPI = async () => {
    const response = await axios.post(createPreferenceIdEndpoint, {
        title: "Test Product",
        unit_price: 100,
        quantity: 1,
    });
}
  return <div></div>;
}

export default MercadoPagoWallet;
