import Request from "./request";

export default class ConsultasAPI {
  static ListarObjetos(
    url,
    page,
    pageSize,
    columnFilters,
    tipo,
    motivo,
    fecha_liquidacion,
    liquidacion,
    estado,
    plazo,
    fecha_desde,
    fecha_hasta
  ) {
    return Request.get(
      url +
        "?offset=" +
        page * 5 +
        "&filters=" +
        JSON.stringify(columnFilters ?? []) +
        "&tipo=" +
        tipo +
        "&motivo=" +
        motivo +
        "&fecha_liquidacion=" +
        fecha_liquidacion +
        "&liquidacion=" +
        liquidacion +
        "&estado=" +
        estado +
        "&plazo=" +
        plazo +
        "&fecha_desde=" +
        fecha_desde +
        "&fecha_hasta=" +
        fecha_hasta
    )
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  }
  static ListarTodos(url) {
    return Request.get(url)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  }
  static BuscarObjetos(url, page, columnFilters) {
    return Request.post(url, { page: page, columnFilters: columnFilters })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  }

  static ObtenerObjeto(url, id) {
    return Request.get(url + id + "/")
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  }

  static BorrarObjeto(url, id) {
    return Request.delete(url + id + "/")
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  }

  static CrearObjeto(url, objeto) {
    return Request.post(url, objeto)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  }

  static CrearObjetoArchivo(url, objeto) {
    return Request.postMultipart(url, objeto)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  }

  static ModificarObjeto(url, id, objeto) {
    return Request.put(url + id + "/", objeto)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  }
}
