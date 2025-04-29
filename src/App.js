import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import Error from "./components/common/Error";
import Footer from "./components/common/Footer";
import Menu from "./components/common/Menu";
// import LoginForm from "./components/views/Login";
import Principal from "./components/views/Principal";
// import AuthHelper from "./helpers/authenticationHelper";
import Reportes from "./components/views/Reportes";
import Productos from "./components/views/Productos/Productos";
import Proveedores from "./components/views/Proveedores/Proveedor";
import Empleado from "./components/views/Empleados/Empleado";
import Cliente from "./components/views/Clientes/Cliente";
import Venta from "./components/views/Ventas/Venta";
import PuntoVenta from "./components/views/PuntoVenta/PuntoVenta";

function App() {
  return (
    <BrowserRouter>
      <Menu />
      <Routes>
        {/* Ruta para la página principal */}
        <Route path="/Principal" element={<Principal />} />

        {/* Redirección de raíz */}
        <Route path="/" element={<Navigate to="/Principal" />} />

        {/* Gestión de productos */}
        <Route exact path="/Gestion-productos" element={<Productos />} />

        {/* Gestión de empleados */}
        <Route exact path="/Gestion-empleados" element={<Empleado />} />

        {/* Gestión de clientes */}
        <Route exact path="/Gestion-clientes" element={<Cliente />} />

        {/* Gestión de ventas */}
        <Route exact path="/Gestion-ventas" element={<Venta />} />

        {/* Punto de venta */}
        <Route exact path="/Punto-venta" element={<PuntoVenta />} />

        {/* Gestión de proveedores */}
        <Route exact path="/Gestion-proveedores" element={<Proveedores />} />

        {/* Reportes */}
        <Route exact path="/Reportes" element={<Reportes />} />

        {/* Página de error */}
        <Route path="*" element={<Error />} />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
