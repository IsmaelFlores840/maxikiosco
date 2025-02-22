import Request from "./request";

export default class ConsultasAPI {
  static ObtenerObjeto(url, id) {
    return Request.get(url + id + "/")
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  }

  static CrearObjeto(url, objeto) {
    return Request.post(url, objeto)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  }

  // Asegúrate de agregar este método
  static ObtenerLista(url) {
    return Request.get(url)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  }
}
