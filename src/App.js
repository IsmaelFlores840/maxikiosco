import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import React, { useState } from "react";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import Error from "./components/common/Error";
import Footer from "./components/common/Footer";
import Menu from "./components/common/Menu";
import LoginForm from "./components/views/Login";
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
    // const favicon = document.getElementById("favicon");
    // favicon.setAttribute("href", icon);
    console.log(user);
  }, []);

  const updateUserState = (newUser, newCambioClave, newRol) => {
    setUser(newUser);
    setCambioClave(newCambioClave);
    setRol(newRol);
  };

  const handleLogout = () => {
    // Función para cerrar sesión y actualizar el estado del usuario a null
    setUser(null);
  };
  return (
    <BrowserRouter>
      <Menu user={user} cambioClave={cambioClave} onLogout={handleLogout} />
      <Routes>
        {/* Rutas accesibles sin estar logueado */}
        <Route
          path="/login"
          element={
            !user ? (
              <LoginForm onLogin={updateUserState} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          exact
          path="/"
          element={
            <LoginForm rolUsuario={rol} redirectTo="/" errorRedirectTo="*" /> // Redirige a /extractos si cambioClave es true
          }
        />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
