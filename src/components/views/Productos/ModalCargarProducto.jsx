import React, { useState, useEffect, useMemo } from "react";
import {
  Col,
  Row,
  Card,
  Form,
  Modal,
  ModalFooter,
  Button,
} from "react-bootstrap";
import "react-datetime/css/react-datetime.css";
import ConsultasAPI from "../../../helpers/consultasAPI";
import Swal from "sweetalert2";
import { MaterialReactTable } from "material-react-table";
import { Delete } from "@mui/icons-material";
import { darken, IconButton } from "@mui/material";

export function ModalCargarProducto(props) {
  const URL_PRODUCTO = window.API_ROUTES.PRODUCTO;
  const URL_CATEGORIA = window.API_ROUTES.CATEGORIA;
  const URL_PROVEEDOR = window.API_ROUTES.PROVEEDOR;
  const [productosTabla, setProductosTabla] = useState([]);
  const [data, setData] = useState([]);
  // const [count, setCount] = useState();

  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [codigo_barras, setCodigoBarras] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tablaCategoria, setTablaCategoria] = useState([]);
  const [tablaProveedor, setTablaProveedor] = useState([]);
  const [proveedor, setProveedor] = useState("");
  const [estado, setEstado] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    crearProducto();
  };

  const handleClose = () => {
    clear();
    props.onClose();
  };
  useEffect(() => {
    cargarCategoria();
    cargarProveedor();
    if (props.tituloModal === "Editar") {
      setNombre(props.datosProducto.nombre ? props.datosProducto.nombre : "");
      setPrecio(
        props.datosProducto.precio_venta ? props.datosProducto.precio_venta : ""
      );
      // setCodigoBarras(props.datosProducto.stock ? props.datosProducto.stock : "");
      setCategoria(
        props.datosProducto.categoria && props.datosProducto.categoria_detalle
          ? props.datosProducto.categoria_detalle
          : ""
      );
      setDescripcion(
        props.datosProducto.descripcion ? props.datosProducto.descripcion : ""
      );
    }
  }, [props.show]);

  const columns = useMemo(() => [
    {
      header: "Nombre",
      accessorKey: "nombre",
      size: 15,
    },
    {
      header: "Precio",
      accessorKey: "precio_venta",
      size: 20,
    },
    {
      header: "Descripción",
      accessorKey: "descripcion",
      size: 20,
    },
  ]);

  const crearProducto = async () => {
    try {
      const result = await Swal.fire({
        title: "¿Está seguro de crear este producto?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        // confirmButtonColor: "#008185",
        cancelButtonColor: "#EC1B23",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const producto = {
          nombre: nombre,
          descripcion: descripcion,
          precio_venta: precio,
          // stock: codigo_barras,
          categoria: categoria,
          // proveedor: proveedor,
        };

        await ConsultasAPI.CrearObjeto(URL_PRODUCTO, producto);

        Swal.fire({
          title: "Creación exitosa",
          text: "Producto generado con éxito",
          icon: "success",
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonColor: "#008185",
          cancelButtonText: "Aceptar",
        });

        clear();
      }
    } catch (error) {
      console.error("Error al crear el producto:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al crear el producto",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      throw error;
    }
  };

  const cargarCategoria = () => {
    try {
      ConsultasAPI.ListarObjetos(URL_CATEGORIA).then((response) => {
        let categorias = response.data.results;
        if (categorias) {
          let datos = [];
          categorias.forEach((categoria) => {
            datos.push({
              id: categoria.id,
              nombre: categoria.nombre,
              descripcion: categoria.descripcion,
            });
          });
          setTablaCategoria(datos);
        }
      });
    } catch (error) {
      console.log("Problemas al mostrar cartones no registrados", error);
    }
  };

  const cargarProveedor = async () => {
    try {
      await ConsultasAPI.ListarObjetos(
        URL_PROVEEDOR,
        pagination.pageIndex,
        pagination.pageSize,
        columnFilters,
        null,
        null,
        null,
        null,
        null,
        null
      ).then((response) => {
        let proveedores = response.data.results;
        if (proveedores) {
          let datos = [];
          proveedores.forEach((proveedor) => {
            datos.push({
              id: proveedor.id,
              nombre: proveedor.nombre,
              telefono: proveedor.telefono,
              direccion: proveedor.direccion,
              email: proveedor.email,
            });
          });
          setTablaProveedor(datos);
        }
      });
    } catch (error) {
      console.log("Problemas al mostrar cartones no registrados", error);
    }
  };

  const clear = () => {
    setDescripcion("");
    setNombre("");
    setPrecio("");
    setCodigoBarras("");
    setCategoria("");
    setProveedor("");
  };

  const handleTablaCategoriaChange = (categoria) => {
    setCategoria(tablaCategoria.filter((x) => x.id === parseInt(categoria))[0]);
  };
  const handleTablaProveedorChange = (proveedor) => {
    setProveedor(tablaProveedor.filter((x) => x.id === parseInt(proveedor))[0]);
  };
  const clean = () => {
    setDescripcion("");
    setNombre("");
    setPrecio("");
    setCodigoBarras("");
    setCategoria("");
    setProveedor("");
  };

  const buscarProducto = async (codigo_barras) => {
    try {
      const response = await ConsultasAPI.ObtenerObjeto(
        URL_PRODUCTO + "buscarProducto/",
        codigo_barras
      );

      if (response.status === 200) {
        console.log(response.data);
        setNombre(response.data.nombre);
        setPrecio(response.data.precio_venta);
        setDescripcion(response.data.descripcion);
        setCodigoBarras(response.data.stock);
        setCategoria(response.data.categoria_detalle.nombre);
        setProveedor(response.data.proveedor);
        setEstado(response.data.estado_producto);
      } else {
        console.warn("Producto no encontrado.");
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    }
  };

  function format(input) {
    var num = input.toString().replace(/\./g, "");
    // if (!isNaN(num)) {
    num = num
      .split("")
      .reverse()
      .join("")
      .replace(/(?=\d*\.?)(\d{3})/g, "$1.");
    num = num.split("").reverse().join("").replace(/^[\.]/, "");
    input = num;
    setPrecio(input);
    return num;
    // }
  }

  const sacarDeTabla = (producto) => () => {
    setProductosTabla((prev) =>
      prev.filter((item) => item.codigo_barras !== producto.codigo_barras)
    );

    setData((prev) =>
      prev.filter((item) => item.codigo_barras !== producto.codigo_barras)
    );

    console.log("Producto eliminado de la tabla:", producto);
  };

  return (
    <Modal show={props.show} size="xl">
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title> {props.tituloModal} Producto</Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={handleSubmit}
        // onKeyDown={handleFormKeyDown}
        style={{ width: "100%" }}
      >
        <Modal.Body style={{ width: "100%" }}>
          <Card className="mb-3">
            <Card.Body className="mb-4">
              <Row
                as={Col}
                md="5"
                className="justify-content-end"
                style={{
                  paddingRight: "15px",
                  paddingTop: "5px",
                }}
              >
                <Button className="fw-bold" onClick={clean}>
                  {/* fw-bold pone las palabras en negrita */}
                  Limpiar
                </Button>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Group
                    // md="3"
                    style={{
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Form.Label>Nombre:</Form.Label>
                    <Col>
                      <Form.Control
                        type="text"
                        value={nombre}
                        readOnly={props.tituloModal === "Consultar"}
                        onChange={(e) => {
                          setNombre(e.target.value);
                        }}
                        required
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group style={{ alignContent: "center" }}>
                    <Form.Label>Precio:</Form.Label>
                    <Col>
                      <Form.Control
                        value={precio}
                        required
                        readOnly={props.tituloModal === "Consultar"}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const precioVenta = inputValue.replace(/\D/g, "");
                          format(precioVenta);
                        }}
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  {props.tituloModal !== "Consultar" ? (
                    <Form.Group
                      style={{
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Form.Label>Categoría:</Form.Label>
                      <Form.Select
                        value={categoria ? categoria.id : ""}
                        onChange={(event) => {
                          handleTablaCategoriaChange(event.target.value);
                        }}
                        required
                      >
                        <option hidden>Elegir Categoria</option>
                        {tablaCategoria.length > 0
                          ? tablaCategoria.map((categoria) => (
                              <option key={categoria.id} value={categoria.id}>
                                {categoria.nombre}
                              </option>
                            ))
                          : null}
                      </Form.Select>
                    </Form.Group>
                  ) : (
                    <Form.Group style={{ alignContent: "center" }}>
                      <Form.Label>Categoría:</Form.Label>
                      <Col>
                        <Form.Control
                          type="text"
                          value={categoria ? categoria : ""}
                          readOnly={props.tituloModal === "Consultar"}
                        />
                      </Col>
                    </Form.Group>
                  )}
                </Col>
                <Col>
                  {props.tituloModal !== "Consultar" ? (
                    <Form.Group
                      style={{
                        alignContent: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Form.Label>Proveedor:</Form.Label>
                      <Form.Select
                        value={proveedor ? proveedor.id : ""}
                        onChange={(event) => {
                          handleTablaProveedorChange(event.target.value);
                        }}
                      >
                        <option hidden>Elegir Proveedor</option>
                        {tablaProveedor.length > 0
                          ? tablaProveedor.map((proveedor) => (
                              <option key={proveedor.id} value={proveedor.id}>
                                {proveedor.nombre}
                              </option>
                            ))
                          : null}
                      </Form.Select>
                    </Form.Group>
                  ) : (
                    <Form.Group style={{ alignContent: "center" }}>
                      <Form.Label>Proveedor:</Form.Label>
                      <Col>
                        <Form.Control
                          type="text"
                          // placeholder={"no posee proveedor"}
                          value={proveedor ? proveedor : ""}
                          readOnly={props.tituloModal === "Consultar"}
                        />
                      </Col>
                    </Form.Group>
                  )}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group
                    style={{ alignContent: "center", justifyContent: "center" }}
                  >
                    <Form.Label>Codigo de Barras:</Form.Label>

                    <Form.Control
                      type="text"
                      value={codigo_barras}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const codigo_barras = inputValue.replace(/\D/g, ""); // Filtrar caracteres no numéricos y limitar la longitud a dos
                        setCodigoBarras(codigo_barras);
                      }}
                      readOnly={props.tituloModal === "Consultar"}
                      required
                    />
                  </Form.Group>
                </Col>
                {props.tituloModal === "Consultar" ? (
                  <Col>
                    <Form.Group style={{ alignContent: "center" }}>
                      <Form.Label>Estado:</Form.Label>
                      <Col>
                        <Form.Control
                          type="text"
                          value={estado ? estado : ""}
                          readOnly={props.tituloModal === "Consultar"}
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                ) : null}
              </Row>
              <Row className="mb-3" style={{ justifyContent: "center" }}>
                <Col>
                  <Form.Group>
                    <Form.Label>Descripción:</Form.Label>
                    <Form.Control
                      type="text"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      readOnly={props.tituloModal === "Consultar"}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <MaterialReactTable
                className="w-100"
                columns={columns}
                data={data}
                muiTableBodyProps={{
                  sx: (theme) => ({
                    "& tr:nth-of-type(odd)": {
                      backgroundColor: darken(
                        theme.palette.background.default,
                        0.1
                      ),
                    },
                    fontFamily: "Roboto, sans-serif", // Configuración de la tipografía para las filas pares
                  }),
                }}
                initialState={{
                  columnVisibility: { id: false }, //hide firstName column by default
                  showColumnFilters: true,
                }}
                editingMode="modal" //default
                enableEditing
                enableRowSelection={false} //enable some features
                enableColumnOrdering={false}
                enableHiding={false}
                enableColumnActions={false}
                enableSorting={false}
                // displayColumnDefOptions={{ "mrt-row-actions": { size: 10 } }} //change width of actions column to 300px
                // enableGlobalFilter={false} //turn off a feature
                enableFilters={false}
                // localization={MRT_Localization_ES}
                enableRowActions
                positionActionsColumn="last"
                renderRowActions={({ row }) => {
                  return (
                    <div className="d-flex">
                      {
                        <IconButton
                          onClick={sacarDeTabla(row.original)}
                          title="Eliminar"
                          variant="outline-info"
                        >
                          <Delete />
                        </IconButton>
                      }
                    </div>
                  );
                }}
                // manualPagination
                // manualFiltering
                muiTablePaginationProps={{
                  rowsPerPageOptions: [10],
                }}
                enablePagination={false} //para mostrar la paginación al final de la tabla
                // rowCount={count}
                // onPaginationChange={setPagination} //hoist pagination state to your state when it changes internally
                onColumnFiltersChange={(value) => {
                  setColumnFilters(value);
                }}
                state={{
                  columnFilters,
                  pagination,
                }}
              />
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn boton m-2" onClick={handleClose}>
            Cancelar
          </Button>
          {props.tituloModal !== "Consultar" ? (
            <Button className="btn boton m-2" type="submit">
              {props.tituloModal === "Editar" ? "Modificar" : "Generar"}{" "}
              Producto
            </Button>
          ) : null}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
export default ModalCargarProducto;
