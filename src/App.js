import "./App.css";
import { useEffect } from "react";
import React, { useState } from "react";
import { Navigate, BrowserRouter, Routes, Route } from "react-router-dom";
import Error from "./components/common/Error";
import Footer from "./components/common/Footer";
import Menu from "./components/common/Menu";
import Login from "./components/views/Login";
import { ProtectedRoute } from "./components/common/ProtectedRoute";

// import icon from "./img/favicon.ico";
import AuthHelper from "./helpers/authenticationHelper";

function App() {
  useEffect(() => {
    // const favicon = document.getElementById("favicon");
    // favicon.setAttribute("href", icon);
  }, []);
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
            !user ? <Login onLogin={updateUserState} /> : <Navigate to="/" />
          }
        />
        {/* <Route exact path="/recuperar-clave" element={<PasswordResetForm />} /> */}
        {/* <Route
          exact
          path="/nueva-clave/:uidb64/:token"
          element={<Newpassword />}
        /> */}

        <Route
          element={
            <ProtectedRoute
              isAllowed={!!user && cambioClave}
              redirectTo="/cambiar-clave"
              errorRedirectTo="/cambiar-clave"
            />
          }
        >
          {/* <Route
            exact
            path="/"
            element={
              rol === "OPERADOR-EXTRACTO" ? (
                <SubirExtracto
                  rolUsuario={rol}
                  redirectTo="/extractos/subir-extracto"
                  errorRedirectTo="*"
                /> // Redirige a /extractos si cambioClave es true
              ) : (
                <Principal rolUsuario={rol} />
              )
            }
          /> */}

          {/* Seccion Liquidaciones */}
          {/* <Route
            exact
            path="/liquidaciones"
            element={
              <ProtectedRoute
                isAllowed={rol === "ADMINISTRADOR"}
                redirectTo="/liquidaciones"
                errorRedirectTo="*"
              >
                <MenuLiquidacion rolUsuario={rol} />
              </ProtectedRoute>
            }
          /> */}
          {/* <Route
            exact
            path="/liquidaciones/comisiones"
            element={
              <ProtectedRoute
                isAllowed={rol === "ADMINISTRADOR"}
                redirectTo="/liquidaciones/comisiones"
                errorRedirectTo="*"
              >
                <Comisiones rolUsuario={rol} />
              </ProtectedRoute>
            }
          /> */}
          {/* <Route
            exact
            path="/liquidaciones/comisiones/enviar-comisiones"
            element={
              <ProtectedRoute
                isAllowed={rol === "ADMINISTRADOR"}
                redirectTo="/liquidaciones/comisiones/enviar-comisiones"
                errorRedirectTo="*"
              >
                <EnviarComisiones rolUsuario={rol} />
              </ProtectedRoute>
            }
          /> */}

          {/* <Route
            path="/cambiar-clave/"
            element={<CambiarClave onLogout={handleLogout} />}
          /> */}
        </Route>
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
