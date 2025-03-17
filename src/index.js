import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider } from "antd";
import esES from "antd/es/locale/es_ES";
import "./index.css";
import "./App.css";
import reportWebVitals from "./reportWebVitals";
import { API_ROUTES, BASE_URL } from "./apiRoutes";
import axios from "axios";

const root = ReactDOM.createRoot(document.getElementById("root"));
//declaracion de variables globales
window.API_ROUTES = API_ROUTES;
window.BASE_URL = BASE_URL;
axios.defaults.baseURL = window.BASE_URL;

root.render(
  <React.StrictMode>
    <ConfigProvider locale={esES}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
