import { Container, Col, Row, Card, Button, Form } from "react-bootstrap";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import ConsultasAPI from "../../../helpers/consultasAPI";
import ModalCargarProducto from "./ModalCargarProducto";
import "react-datetime/css/react-datetime.css";
import BtnVolver from "../../common/BtnVolver";
import Datetime from "react-datetime";
import { Edit, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import { darken, IconButton } from "@mui/material";

const Productos = (props) => {
  const URL_CATEGORIA = window.API_ROUTES.CATEGORIA;
  const URL_PRODUCTO = window.API_ROUTES.PRODUCTO;
  const rolUser = props.rolUsuario;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [count, setCount] = useState();
  const [fechaDesde, setFechaDesde] = useState({
    fechaMuestra: null,
    fechaComparar: null,
  });
  const [fechaHasta, setFechaHasta] = useState({
    fechaMuestra: null,
    fechaComparar: null,
  });

  const [modalCargarProducto, setModalCargarProducto] = useState(false);
  const [columnFilters, setColumnFilters] = useState([]);
  const [data, setData] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [tablaCategoria, setTablaCategoria] = useState([]);
  const datetimeRefHasta = useRef(null);
  const datetimeRefDesde = useRef(null);
  const [producto, setProducto] = useState("");
  const [datosProducto, setDatossProducto] = useState([]);
  const [tituloModal, setTituloModal] = useState("");

  useEffect(() => {
    cargarCategoria();
  }, [props.show]);
  useEffect(() => {
    cargarProductos();
  }, [
    fechaDesde.fechaMuestra,
    fechaHasta.fechaMuestra,
    producto,
    categoria,
    modalCargarProducto,
  ]);

  const cargarCategoria = () => {
    try {
      ConsultasAPI.ListarObjetos(URL_CATEGORIA, null, null, null, null).then(
        (response) => {
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
        }
      );
    } catch (error) {
      console.log("Problemas al mostrar las categorias", error);
    }
  };

  const handleTablaCategoriaChange = (categoria) => {
    setCategoria(tablaCategoria.filter((x) => x.id === parseInt(categoria))[0]);
  };
  //Columnas de la tabla Venta Mostrador
  const columns = useMemo(() => [
    {
      header: "Nombre",
      accessorKey: "nombre",
      size: 15,
    },
    {
      header: "Categoria",
      accessorKey: "categoria",
      size: 20,
    },
    {
      header: "Stock",
      accessorKey: "stock",
      size: 20,
    },
    {
      header: "Estado",
      accessorKey: "estado",
      size: 20,
    },
    {
      header: "Precio",
      accessorKey: "precio",
      size: 20,
    },
    {
      header: "Total",
      accessorKey: "total",
      size: 20,
    },
  ]);

  const handleFechaDesdeChange = (momentDate) => {
    const fechaMuestra = momentDate.format("DD/MM/YYYY");
    const fechaComparar = momentDate.format("YYYY-MM-DD");
    setFechaDesde({ fechaMuestra: fechaMuestra, fechaComparar: fechaComparar });
  };

  const handleFechaHastaChange = (momentDate) => {
    const fechaMuestra = momentDate.format("DD/MM/YYYY");
    const fechaComparar = momentDate.format("YYYY-MM-DD");
    setFechaHasta({ fechaMuestra: fechaMuestra, fechaComparar: fechaComparar });
  };

  const handleOpenModalAgregarProducto = () => {
    setTituloModal("Agregar");
    setModalCargarProducto(true);
  };
  const handleCloseModalAgregarProducto = () => {
    setTituloModal("");
    setModalCargarProducto(false);
  };

  // Para el botón de limpiar filtro
  var limpiarFiltros = function () {
    setProducto("");
    setCategoria("");
    setFechaDesde({ fechaMuestra: null, fechaComparar: null });
    setFechaHasta({ fechaMuestra: null, fechaComparar: null });
    datetimeRefHasta.current.setState({ inputValue: "" });
    datetimeRefDesde.current.setState({ inputValue: "" });
  };

  const cargarProductos = async () => {
    try {
      const response = await ConsultasAPI.ListarObjetos(
        URL_PRODUCTO,
        pagination.pageIndex,
        pagination.pageSize,
        columnFilters,
        fechaDesde.fechaMuestra,
        fechaHasta.fechaMuestra,
        producto,
        null,
        categoria ? categoria.nombre : ""
      );
      const productos = response.data.results;
      if (productos) {
        let datos = [];
        productos.forEach((producto) => {
          datos.push({
            id: producto.id ? producto.id : "",
            nombre: producto.nombre ? producto.nombre : "",
            categoria: producto.categoria_detalle.nombre,
            stock: producto.stock ? producto.stock : "0",
            estado: producto.stock !== 0 ? "DISPONIBLE" : "AGOTADO",
            precio: producto.precio_venta ? producto.precio_venta : "",
            total: producto.precio_venta * producto.stock, //arreglar esto mas tarde
          });
        });
        setData(datos);
        setCount(response.data.count);
      }
    } catch (error) {
      console.log("Problemas al mostrar los productos", error);
    }
  };

  const handleEliminarProducto = async (row) => {
    await Swal.fire({
      title: "Esta seguro de borrar este producto?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      showConfirmButton: true,
      confirmButtonColor: "#008185",
      cancelButtonColor: "#EC1B23",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        ConsultasAPI.BorrarObjeto(URL_PRODUCTO, row.id)
          .then((response) => {
            if (response.status === 204) {
              Swal.fire({
                title: "Producto Eliminado Exitosamente",
                text: "Esta acción no se podrá deshacer",
                icon: "success",
              });
            } else {
              Swal.fire({
                title: "Error: problema con la eliminación",
                text: "El Producto no se pudo borrar correctamente",
                icon: "error",
              });
            }
          })
          .then(() => {
            cargarProductos(); // Llamo a cargarTabla después de la eliminación
          });
      }
    });
  };

  const handleEditarProducto = async (row) => {
    const producto = await ConsultasAPI.ObtenerObjeto(URL_PRODUCTO, row.id);
    setDatossProducto(producto.data);
    setTituloModal("Editar");
    setModalCargarProducto(true);
  };

  return (
    <Container className="mt-4 mb-4 mainSection">
      <Card>
        <Card.Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // Centra verticalmente los elementos hijos
          }}
        >
          <h2 className="py-2 fw ml-10">Productos</h2>
          <Button
            className="btn"
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
            onClick={handleOpenModalAgregarProducto}
          >
            Agregar
          </Button>
        </Card.Header>
        <Card.Body className="mb-13" style={{ paddingBottom: 0 }}>
          <Row
            style={{
              padding: 10,
            }}
          >
            <Col>
              <Form.Group
                style={{
                  alignItems: "center",
                }}
              >
                <Form.Label>Fecha Desde:</Form.Label>
                <Datetime
                  timeFormat={false}
                  style={{ width: "100%", height: "32px" }}
                  dateFormat="DD/MM/YYYY"
                  updateOnView=""
                  inputProps={{
                    readOnly: true,
                    placeholder: "Elegir fecha",
                  }}
                  ref={datetimeRefDesde}
                  value={null}
                  onChange={handleFechaDesdeChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group
                style={{
                  alignItems: "center",
                }}
              >
                <Form.Label>Fecha Hasta:</Form.Label>
                <Datetime
                  timeFormat={false}
                  style={{ width: "100%", height: "32px" }}
                  dateFormat="DD/MM/YYYY"
                  updateOnView=""
                  inputProps={{
                    readOnly: true,
                    placeholder: "Elegir fecha",
                  }}
                  ref={datetimeRefHasta}
                  value={null}
                  onChange={handleFechaHastaChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group
                style={{
                  alignItems: "center",
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
            </Col>
            <Col>
              <Form.Group
                style={{
                  alignItems: "center",
                }}
              >
                <Form.Label>Producto:</Form.Label>
                <Form.Control
                  type="text"
                  value={producto}
                  onChange={(e) => {
                    setProducto(e.target.value);
                  }}
                  required
                />
              </Form.Group>
            </Col>
            <Col
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Button
                onClick={() => {
                  limpiarFiltros();
                }}
              >
                Limpiar
              </Button>
            </Col>
          </Row>
          <Card className="mb-13">
            <MaterialReactTable
              className="w-100"
              columns={columns}
              data={data}
              muiTablePaperProps={{
                elevation: 0,
                sx: {
                  borderRadius: "0",
                  // border: "1px dashed #e0e0e0",
                },
              }}
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
              enableRowSelection={false} //enable some features
              enableColumnOrdering={false}
              enableHiding={false}
              enableColumnActions={false}
              enableSorting={false}
              displayColumnDefOptions={{ "mrt-row-actions": { size: 10 } }} //change width of actions column to 300px
              enableGlobalFilter={false} //turn off a feature
              enableFilters={false}
              localization={MRT_Localization_ES}
              enableRowActions
              positionActionsColumn="last"
              renderRowActions={({ row }) => (
                <div className="d-flex">
                    <IconButton
                      onClick={() => {
                        handleEditarProducto(row.original);
                      }}
                      title="Editar"
                      variant="outline-info"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleEliminarProducto(row.original);
                      }}
                      title="Eliminar"
                      variant="outline-info"
                    >
                      <Delete />
                    </IconButton>
                </div>
              )}
              // manualPagination
              // manualFiltering
              muiTablePaginationProps={{
                rowsPerPageOptions: [10],
              }}
              enablePagination={true}
              rowCount={count}
              onPaginationChange={setPagination} //hoist pagination state to your state when it changes internally
              onColumnFiltersChange={(value) => {
                setColumnFilters(value);
              }}
              state={{
                columnFilters,
                pagination,
              }}
            />
          </Card>
          {/* </Card> */}
          <Row
            className="text-center"
            // style={{ marginRight: 10, marginTop: 10, justifyContent: "end", display: "flex" }}
          >
            <section className="d-flex justify-content-end my-3">
              <BtnVolver
                className="btn boton  fw-bold"
                to="/Principal"
                style={{ float: "right" }}
              >
                Volver
              </BtnVolver>
            </section>
          </Row>
        </Card.Body>
      </Card>

      <ModalCargarProducto
        onClose={handleCloseModalAgregarProducto}
        show={modalCargarProducto}
        tituloModal={tituloModal}
        datosProducto={datosProducto}
      />
    </Container>
  );
};

export default Productos;
