import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import React, { useState } from "react";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import Error from "./components/common/Error";
import Footer from "./components/common/Footer";
import Menu from "./components/common/Menu";
import LoginForm from "./components/views/Login";
import Principal from "./components/views/Principal";
import AuthHelper from "./helpers/authenticationHelper";

function App() {
  const [cambioClave, setCambioClave] = useState(
    AuthHelper.getHasChangedPassword()
      ? AuthHelper.getHasChangedPassword()
      : false
  );
  const [user, setUser] = useState(
    AuthHelper.getUser() ? AuthHelper.getUser() : null
  );
  const [rol, setRol] = useState(
    AuthHelper.getRol() ? AuthHelper.getRol() : null
  );

  useEffect(() => {
    // Aquí puedes agregar lógica adicional si es necesario
  }, []);

  const updateUserState = (newUser, newCambioClave, newRol) => {
    setUser(newUser);
    setCambioClave(newCambioClave);
    setRol(newRol);
  };

  const handleLogout = () => {
    setUser(null);
    AuthHelper.logout(); // Asegúrate de limpiar el estado de autenticación
  };

  return (
    <BrowserRouter>
      <Menu user={user} cambioClave={cambioClave} onLogout={handleLogout} />
      <Routes>
        {/* Ruta para el login */}
        <Route
          path="/login"
          element={
            !user ? (
              <LoginForm onLogin={updateUserState} />
            ) : (
              <Navigate to="/Principal" />
            )
          }
        />

        {/* Ruta para la página principal (menú) */}
        <Route
          path="/Principal"
          element={
            user ? <Principal rolUsuario={rol} /> : <Navigate to="/login" />
          }
        />

        {/* Ruta raíz: redirige a /Principal si está logueado, o a /login si no lo está */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/Principal" /> : <Navigate to="/login" />
          }
        />

        {/* Ruta para errores */}
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
