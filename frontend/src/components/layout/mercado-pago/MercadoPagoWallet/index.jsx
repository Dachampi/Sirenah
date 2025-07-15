import { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import axios from "axios";
import PropTypes from "prop-types";

function MercadoPagoWallet({ triggerPayment, cartData }) {
  const [preferenceId, setPreferenceId] = useState(null);
  const publicKey = import.meta.env.VITE_PUBLIC_KEY_MP;

  const createPreferenceIdEndpoint = `${
    import.meta.env.VITE_API
  }/todosroles/MercadoPago/ProcederPagar`;

  useEffect(() => {
    initMercadoPago(publicKey, { locale: "es-PE" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (triggerPayment && cartData) {
      createPreferenceIdFromAPI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerPayment]);

  const createPreferenceIdFromAPI = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(createPreferenceIdEndpoint, cartData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPreferenceId(response.data.preferenceId);
    } catch (error) {
      console.error("Error creating preference", error);
    }
  };
  
  return (
    <div>
      {preferenceId && (
        <Wallet
          initialization={{ preferenceId }}
          customization={{ texts: { valueProp: "smart_option" } }}
        />
      )}
    </div>
  );
}
MercadoPagoWallet.propTypes = {
  triggerPayment: PropTypes.bool.isRequired,
  cartData: PropTypes.object.isRequired,
};


export default MercadoPagoWallet;
