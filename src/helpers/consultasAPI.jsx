import Request from "./request";

export default class ConsultasAPI {
  static ListarObjetos( //modificar los parametros
    url,
    page,
    pageSize,
    columnFilters,
    fechaDesde,
    fechaHasta,
    estado,
    tipo,
    zona,
    localidad,
    sorting,
    fechaExceptuada,
    sorteo,
    titular,
    apellido,
    agencia
  ) {
    return Request.get(
      url +
        "?offset=" +
        page * 10 +
        "&fechaDesde=" +
        (fechaDesde ? fechaDesde : null) +
        "&fechaHasta=" +
        (fechaHasta ? fechaHasta : null) +
        "&estado=" +
        estado +
        "&tipo=" +
        tipo +
        "&zona=" +
        zona +
        "&apellido=" +
        apellido +
        "&localidad=" +
        localidad +
        "&filters=" +
        JSON.stringify(columnFilters ?? []) +
        "&sorting=" +
        JSON.stringify(sorting ?? []) +
        "&fechaExceptuada=" +
        (fechaExceptuada ? fechaExceptuada : null) +
        "&sorteo=" +
        sorteo +
        "&titular=" +
        titular +
        "&agencia=" +
        agencia

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
