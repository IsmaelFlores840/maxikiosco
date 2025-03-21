import Request from "./request";

export default class ConsultasAPI {
  static ListarObjetos(
    url,
    page,
    pageSize,
    columnFilters,
    fechaDesde,
    fechaHasta,
    nombre,
    numero,
    categoria,
    email,
    sorting
  ) {
    return Request.get(
      url +
        "?offset=" +
        page * 10 +
        "&fechaDesde=" +
        (fechaDesde ? fechaDesde : null) +
        "&fechaHasta=" +
        (fechaHasta ? fechaHasta : null) +
        "&nombre=" +
        nombre +
        "&numero=" +
        numero +
        "&categoria=" +
        categoria +
        "&email=" +
        email +
        "&filters=" +
        JSON.stringify(columnFilters ?? []) +
        "&sorting=" +
        JSON.stringify(sorting ?? [])

      //  ,{params:{page:page, filters:JSON.stringify(columnFilters ?? [])}}
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
    // console.log(objeto);
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
