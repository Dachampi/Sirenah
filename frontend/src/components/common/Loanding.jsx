import PropTypes from "prop-types";
import "../../styles/Loanding.css";

function Loading({ message = "Cargando..." }) {
    return (
        <div className="loading-overlay">
            <div className="loading-modal">
                <div className="spinner"></div>
                <p>{message}</p>
            </div>
        </div>
    );
}

Loading.propTypes = {
    message: PropTypes.string, // Define que message debe ser una cadena
};

export default Loading;