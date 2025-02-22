import axios from "axios";
// import AuthenticationHelper from "./authenticationHelper";
// import Notificaciones from "./notificacionesToast";

// const errorHandler = (error) => {
//   if (error.response) {
//     let message;
//     try {
//       message =
//         typeof error.response.data !== "object"
//           ? error.response.data
//           : error.response.data.error
//           ? error.response.data.error
//           : error.response.data.ExceptionMessage
//           ? error.response.data.ExceptionMessage
//           : error.response.data.Message
//           ? error.response.data.Message
//           : error.response.data.message
//           ? error.response.data.message
//           : "Ocurrio un error...";
//     } catch (e) {
//       message = "Ocurrio un error...";
//     }

//     message =
//       message.length > 300 ? message.substring(0, 300) + "..." : message;

//     switch (error.response.status) {
//       case 401:
//         if (window.location.pathname !== "/login") {
//           AuthenticationHelper.logout(() => {
//             window.location.replace("/login");
//           });
//         }
//         Notificaciones.notificacion("Usuario o contraseña incorrectos");

//         break;
//       case 404:
//         message =
//           "[Endpoint No encontrado] " +
//           error.response.config.baseURL +
//           error.response.config.url;
//         Notificaciones.notificacion(message);
//         break;
//       default:
//       // Notificaciones.notificacion(message);
//     }
//     return Promise.reject(error);
//   }
//   // let message = error.data && typeof error.data !== 'object' ? error.data : error && typeof error !== 'object' ? error : 'Ocurrió un error';
//   //   Notificaciones.notificacion(message);
//   return Promise.reject(error);
// };

// axios.interceptors.request.use((config) => {
//   config.headers = AuthenticationHelper.isJwtTokenStored()
//     ? {
//         ...config.headers,
//         Authorization: `Bearer ${AuthenticationHelper.getJwtToken()}`,
//       }
//     : config.headers;
//   return config;
// });

// axios.interceptors.response.use(
//   (response) => {
//     if (response.data.ValidationErrors) {
//       let validationMessage = "";
//       for (const validationType in response.data.ValidationErrors) {
//         validationMessage +=
//           response.data.ValidationErrors[validationType] + "\n";
//       }
//       response.status = 400;
//       return errorHandler(validationMessage);
//     }
//     return response;
//   },
//   (error) => errorHandler(error)
// );

export default class Request {
  static get(path, callback) {
    return axios.get(path, { callback });
  }

  static post(path, data = {}, callback) {
    return axios.post(path, data, { callback });
  }

  static postMultipart(path, data = {}, callback) {
    return axios.post(path, data, {
      callback,
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      },
    });
  }

  static put(path, data = {}, callback) {
    return axios.put(path, data, { callback });
  }

  static delete(path, callback) {
    return axios.delete(path, { callback });
  }

  static patch(path, data = {}, callback) {
    return axios.patch(path, data, { callback });
  }

  static download(path) {
    return axios({ url: path, method: "GET", responseType: "blob" });
  }
}
