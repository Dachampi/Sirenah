import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaIdCard,
  FaPhone,
  FaTimes,
} from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import "../../styles/stylesAdm/FormEmp.css";
import {
  validarNombre,
  validarApellido,
  validarEmail,
  validarDni,
  validarTelefono,
  validarFechaNacimiento,
  validarPassword,
  validarConfirmPassword,
} from "../../utils/Validaciones";
import { AlertaDeExito, AlertaDeError } from "../../utils/Alertas";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/common/Loanding";

function RegistroEMPLEADO() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [errores, setErrores] = useState({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const manejarRegistro = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrores((prev) => ({
        ...prev,
        confirmPassword: "Las contraseñas no coinciden.",
      }));
      return;
    }

    if (Object.values(errores).some((error) => error)) return;

    try {
      const response = await fetch("https://apiperu.dev/api/dni", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_TOKEN_API_RENIEC}`,
        },
        body: JSON.stringify({ dni }),
      });

      const data = await response.json();
      if (
        nombre.toUpperCase() !== data.data.nombres &&
        apellido.toUpperCase() !==
          data.data.apellido_paterno + " " + data.data.apellido_materno
      ) {
        setErrores((prev) => ({
          ...prev,
          nombre: "Verificar que el nombre sea correcto.",
        }));
        setErrores((prev) => ({
          ...prev,
          apellido: "Verificar que el apellido sea correcto.",
        }));
        return;
      } else if (nombre.toUpperCase() !== data.data.nombres) {
        setErrores((prev) => ({
          ...prev,
          nombre: "Verificar que el nombre sea correcto.",
        }));
        return;
      } else if (
        apellido.toUpperCase() !==
        data.data.apellido_paterno + " " + data.data.apellido_materno
      ) {
        setErrores((prev) => ({
          ...prev,
          apellido: "Verificar que el apellido sea correcto.",
        }));
        return;
      } else if ("No se encontraron registros" == data.message) {
        setErrores((prev) => ({
          ...prev,
          dni: "No se encontraron registros.",
        }));
        return;
      }

      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setErrores((prev) => ({ ...prev, dni: "No se encontraron registros." }));
      return;
    }

    const body = {
      name: nombre,
      email: email,
      password: password,
      role: "EMPLEADO",
      ourUsers: {
        apellido: apellido,
        dni: dni,
        telefono: telefono,
        fecha_nacimiento: fechaNacimiento,
      },
    };
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (data.statuscode === 200) {
        AlertaDeExito("¡Exitoso!", "Se ha registrado correctamente.");
        setEmail("");
        setPassword("");
        setNombre("");
        setApellido("");
        setDni("");
        setTelefono("");
        setFechaNacimiento("");
        setConfirmPassword("");
        setErrores({});
      } else if (data.statuscode === 409) {
        setIsLoading(false);
        AlertaDeError("Error", "Ya hay un usuario con el email registrado");
        return;
      } else if (data.statuscode === 410) {
        setIsLoading(false);
        AlertaDeError("Error", "Ya hay un usuario con el DNI registrado");
        return;
      } else if (data.statuscode === 500) {
        setIsLoading(false);
        AlertaDeError(
          "Error",
          "Hubo un problema con el servidor. Intenta nuevamente.'"
        );
        return;
      }
      setIsLoading(false);
      setTimeout(() => {
        navigate("/MenuAdmin/Empleados");
      }, 2000);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setErrores({ global: "Hubo un error al registrar. Intenta nuevamente." });
      setSuccess("");
    } finally {
      setIsLoading(false);
    }
  };

  const alternarVisibilidadPassword = () => {
    setMostrarPassword(!mostrarPassword);
  };
  return (
  <div className="contenedor-empleado">
    {isLoading && (
      <Loading message="Registrando empleado, por favor espera..." />
    )}
    <button
      className="btn-cerrar-empleado"
      onClick={() => (window.location.href = "/MenuAdmin/Empleados")}
    >
      <FaTimes className="icono-cerrar-empleado" />
    </button>
    <form onSubmit={manejarRegistro} className="formulario-empleado">
      <h2 className="titulo-empleado">¡Agrega un nuevo empleado!</h2>
      <div className="grupo-input-empleado">
        <label className="etiqueta-empleado">Nombre Completo:</label>
        <div className="input-con-icono-empleado">
          <FaUser className="icono-empleado" />
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa el nombre"
            className="input-empleado"
            onBlur={() => validarNombre(nombre, setErrores)}
          />
        </div>
        {errores.nombre && <p className="mensaje-error-empleado">{errores.nombre}</p>}
      </div>
      <div className="grupo-input-empleado">
        <label className="etiqueta-empleado">Apellidos Completos:</label>
        <div className="input-con-icono-empleado">
          <FaUser className="icono-empleado" />
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            placeholder="Ingresa los apellidos"
            className="input-empleado"
            onBlur={() => validarApellido(apellido, setErrores)}
          />
        </div>
        {errores.apellido && (
          <p className="mensaje-error-empleado">{errores.apellido}</p>
        )}
      </div>
      <div className="grupo-input-empleado">
        <label className="etiqueta-empleado">Correo Electrónico:</label>
        <div className="input-con-icono-empleado">
          <FaEnvelope className="icono-empleado" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresa el correo"
            className="input-empleado"
            onBlur={() => validarEmail(email,null, setErrores)}
          />
        </div>
        {errores.email && <p className="mensaje-error-empleado">{errores.email}</p>}
      </div>
      <div className="grupo-input-empleado">
        <label className="etiqueta-empleado">DNI:</label>
        <div className="input-con-icono-empleado">
          <FaIdCard className="icono-empleado" />
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            placeholder="Ingresa el DNI"
            className="input-empleado"
            onBlur={() => validarDni(dni, setErrores)}
          />
        </div>
        {errores.dni && <p className="mensaje-error-empleado">{errores.dni}</p>}
      </div>
      <div className="grupo-input-empleado">
        <label className="etiqueta-empleado">Teléfono:</label>
        <div className="input-con-icono-empleado">
          <FaPhone className="icono-empleado" />
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Ingresa el teléfono"
            className="input-empleado"
            onBlur={() => validarTelefono(telefono, setErrores)}
          />
        </div>
        {errores.telefono && (
          <p className="mensaje-error-empleado">{errores.telefono}</p>
        )}
      </div>
      <div className="grupo-input-empleado">
        <label className="etiqueta-empleado">Fecha de Nacimiento:</label>
        <input
          type="date"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
          className="input-empleado"
          onBlur={() => validarFechaNacimiento(fechaNacimiento, setErrores)}
        />
        {errores.fechaNacimiento && (
          <p className="mensaje-error-empleado">{errores.fechaNacimiento}</p>
        )}
      </div>
      <div className="grupo-input-empleado">
        <label className="etiqueta-empleado">Contraseña:</label>
        <div className="input-con-icono-empleado">
          <FaLock className="icono-empleado" />
          <input
            type={mostrarPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa la contraseña"
            className="input-empleado"
            onBlur={() => validarPassword(password, setErrores)}
          />
        </div>
        {errores.password && (
          <p className="mensaje-error-empleado">{errores.password}</p>
        )}
      </div>
      <div className="grupo-input-empleado">
        <label className="etiqueta-empleado">Confirmar Contraseña:</label>
        <div className="input-con-icono-empleado">
          <FaLock className="icono-empleado" />
          <input
            type={mostrarPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirma la contraseña"
            className="input-empleado"
            onBlur={() =>
              validarConfirmPassword(password, confirmPassword, setErrores)
            }
          />
        </div>
        {errores.confirmPassword && (
          <p className="mensaje-error-empleado">{errores.confirmPassword}</p>
        )}
      </div>
      <button
        type="button"
        onClick={alternarVisibilidadPassword}
        className="btn-mostrar-password-empleado"
      >
        {mostrarPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
        {mostrarPassword ? " Ocultar contraseña" : " Mostrar contraseña"}
      </button>
      {success && <p className="mensaje-exito-empleado">{success}</p>}
      {errores.global && <p className="mensaje-error-empleado">{errores.global}</p>}

      <button type="submit" className="boton-empleado">
        Registrar Empleado
      </button>
    </form>
  </div>
);

}

export default RegistroEMPLEADO;
