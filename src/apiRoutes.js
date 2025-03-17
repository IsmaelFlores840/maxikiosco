export const BASE_URL = process.env.REACT_APP_API_BASE_URL;
// export const BASE_URL =
//   process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api/";
export const API_ROUTES = {
  USUARIOS: BASE_URL + "users/",
  PRODUCTO: BASE_URL + "producto/",
  ROL: BASE_URL + "rol/",
  DETALLEVENTA: BASE_URL + "detalle-venta/",
  CATEGORIA: BASE_URL + "categoria/",
  PROVEEDOR: BASE_URL + "proveedor/",
  CLIENTE: BASE_URL + "cliente/",
  VENTA: BASE_URL + "venta/",
  EMPLEADO: BASE_URL + "empleado/",
};
