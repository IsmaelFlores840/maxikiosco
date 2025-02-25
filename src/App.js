import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import React, { useState } from "react";
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
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;
