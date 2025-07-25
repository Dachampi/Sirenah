import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Inicio from "../views/Home/Inicio";
import Catalogo from "../views/Home/Catalogo";
import Nosotros from "../views/Home/Nosotros";
import Contacto from "../views/Home/Contacto";
import Login from "../views/Login/Login";
import Registro from "../views/Login/Registro";

import Productos from "../views/MenuAdm/Productos";
import Usuarios from "../views/MenuAdm/Usuarios";
import Analiticas from "../views/MenuAdm/Analiticas";
import Ayuda from "../views/MenuAdm/Ayuda";
import Perfil from "../views/MenuAdm/Perfil";
import Categorias from "../views/MenuAdm/Categorias";
import Administradores from "../views/MenuAdm/Administradores";
import Empleados from "../views/MenuAdm/Empleados";

import ProtegerRutas from "./ProtegerRutas";

import UInicio from "../views/MenuUser/Inicio";
import UMisCompras from "../views/MenuUser/MisCompras";
import UCarrito from "../views/MenuUser/Carrito";
import UListaDeseos from "../views/MenuUser/ListaDeseos";
import UDirecciones from "../views/MenuUser/Direcciones";
import UPerfil from "../views/MenuUser/Perfil";
import UAyuda from "../views/MenuUser/Ayuda";
import Success from "../views/StatusPagos/Success";
import Failure from "../views/StatusPagos/Failure";
import Pending from "../views/StatusPagos/Pending";
import RegistroADMIN from "../views/Login/RegistroADMIN";
import RegistroEMPLEADO from "../views/Login/RegistroEMPLEADO";
import Reportes from "../views/MenuAdm/Reportes";
import MisPedidos from "../views/MenuUser/MisPedidos";
import Ventas from "../views/MenuAdm/Ventas";

function Rutas() {
  return (
    <Router>
      <Routes>
        <Route path="/Home" element=<Inicio /> />
        <Route path="/Catalogo" element=<Catalogo /> />
        <Route path="/Nosotros" element=<Nosotros /> />
        <Route path="/Contacto" element=<Contacto /> />
        <Route path="/Login" element=<Login /> />
        <Route path="/Registro" element=<Registro /> />
        <Route path="/" element={<Navigate to="/Home" />} />
        <Route
          path="/MenuAdmin/Ventas"
          element={
            <ProtegerRutas allowedRoles={["ADMIN"]}>
              <Ventas />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuAdmin/Productos"
          element={
            <ProtegerRutas allowedRoles={["ADMIN","EMPLEADO"]}>
              <Productos />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuAdmin/Usuarios"
          element={
            <ProtegerRutas allowedRoles={["ADMIN", "EMPLEADO"]}>
              <Usuarios />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuAdmin/Analiticas"
          element={
            <ProtegerRutas allowedRoles={["ADMIN"]}>
              <Analiticas />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuAdmin/Administradores/Agregar"
          element={
            <ProtegerRutas allowedRoles={["ADMIN"]}>
              <RegistroADMIN />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuAdmin/Empleados/Agregar"
          element={
            <ProtegerRutas allowedRoles={["ADMIN"]}>
              <RegistroEMPLEADO />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuAdmin/Reportes"
          element={
            <ProtegerRutas allowedRoles={["ADMIN"]}>
              <Reportes />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuAdmin/Ayuda"
          element={
            <ProtegerRutas allowedRoles={["ADMIN","EMPLEADO"]}>
              <Ayuda />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuAdmin/Perfil"
          element={
            <ProtegerRutas allowedRoles={["ADMIN","EMPLEADO"]}>
              <Perfil />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuAdmin/Categorias"
          element={
            <ProtegerRutas allowedRoles={["ADMIN","EMPLEADO"]}>
              <Categorias />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuAdmin/Administradores"
          element={
            <ProtegerRutas allowedRoles={["ADMIN"]}>
              <Administradores />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuAdmin/Empleados"
          element={
            <ProtegerRutas allowedRoles={["ADMIN"]}>
              <Empleados />
            </ProtegerRutas>
          }
        />

        <Route
          path="/MenuCliente/Inicio"
          element={
            <ProtegerRutas allowedRoles={["USER", "ADMIN", "EMPLEADO"]}>
              <UInicio />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuCliente/MisCompras"
          element={
            <ProtegerRutas allowedRoles={["USER", "ADMIN", "EMPLEADO"]}>
              <UMisCompras />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuCliente/MisPedidos"
          element={
            <ProtegerRutas allowedRoles={["USER", "ADMIN", "EMPLEADO"]}>
              <MisPedidos />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuCliente/Carrito"
          element={
            <ProtegerRutas allowedRoles={["USER", "ADMIN", "EMPLEADO"]}>
              <UCarrito />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuCliente/ListaDeseos"
          element={
            <ProtegerRutas allowedRoles={["USER", "ADMIN", "EMPLEADO"]}>
              <UListaDeseos />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuCliente/Direcciones"
          element={
            <ProtegerRutas allowedRoles={["USER", "ADMIN", "EMPLEADO"]}>
              <UDirecciones />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuCliente/Perfil"
          element={
            <ProtegerRutas allowedRoles={["USER", "ADMIN", "EMPLEADO"]}>
              <UPerfil />
            </ProtegerRutas>
          }
        />
        <Route
          path="/MenuCliente/Ayuda"
          element={
            <ProtegerRutas allowedRoles={["USER", "ADMIN", "EMPLEADO"]}>
              <UAyuda />
            </ProtegerRutas>
          }
        />
        <Route
          path="/PagoExitoso"
          element={
            <ProtegerRutas allowedRoles={["USER", "ADMIN", "EMPLEADO"]}>
              <Success />
            </ProtegerRutas>
          }
        />
        <Route
          path="/PagoFallido"
          element={
            <ProtegerRutas allowedRoles={["USER", "ADMIN", "EMPLEADO"]}>
              <Failure />
            </ProtegerRutas>
          }
        />
        <Route
          path="/PagoPendiente"
          element={
            <ProtegerRutas allowedRoles={["USER", "ADMIN", "EMPLEADO"]}>
              <Pending />
            </ProtegerRutas>
          }
        />
      </Routes>
    </Router>
  );
}

export default Rutas;
