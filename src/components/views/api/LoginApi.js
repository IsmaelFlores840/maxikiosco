import AuthenticationHelper from "../../../helpers/authenticationHelper";
import Request from "../../../helpers/request";

const MAX_REQUEST_TIMEOUT = 3000; // Tiempo de espera máximo en milisegundos (3 segundos)

const LoginApi = {
  Login: (email, password) => {
    let requestTimeout = null;

    const requestPromise = Request.post("login/token/", {
      email: email,
      password: password,
    })
      .then((response) => {
        clearTimeout(requestTimeout); // Limpiamos el tiempo de espera si la solicitud se completó correctamente
        AuthenticationHelper.storeJwtToken("Bearer " + response.data.access);
        AuthenticationHelper.storeRol(response.data.rol);
        AuthenticationHelper.storeUser(email);
        AuthenticationHelper.storeHasChangedPassword(
          response.data.has_changed_password
        );
        return response;
      })
      .catch((error) => {
        clearTimeout(requestTimeout); // Limpiamos el tiempo de espera si ocurrió un error en la solicitud
        throw error;
      });

    // Configuramos el tiempo de espera máximo
    const timeoutPromise = new Promise((resolve, reject) => {
      requestTimeout = setTimeout(() => {
        reject(new Error("Tiempo de espera de la solicitud excedido"));
      }, MAX_REQUEST_TIMEOUT);
    });

    // Ejecutamos ambas promesas simultáneamente y esperamos que una se resuelva primero
    return Promise.race([requestPromise, timeoutPromise]);
  },
};
export default LoginApi;
