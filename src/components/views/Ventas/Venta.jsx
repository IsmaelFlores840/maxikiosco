import { Container, Col, Row, Card, Button, Form } from "react-bootstrap";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import ModalVenta from "./ModalVenta";
import ConsultasAPI from "../../../helpers/consultasAPI";
import "react-datetime/css/react-datetime.css";
import BtnVolver from "../../common/BtnVolver";
import Datetime from "react-datetime";
import { Edit, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import moment from "moment";
import { darken, IconButton } from "@mui/material";

const Ventas = (props) => {
  const rolUser = props.rolUsuario;
  const URL_CLIENTE = window.API_ROUTES.CLIENTE;
  const URL_VENTA = window.API_ROUTES.VENTA;
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [fechaDesde, setFechaDesde] = useState({
    fechaMuestra: null,
    fechaComparar: null,
  });
  const [fechaHasta, setFechaHasta] = useState({
    fechaMuestra: null,
    fechaComparar: null,
  });
  const datetimeRefHasta = useRef(null);
  const datetimeRefDesde = useRef(null);
  const [count, setCount] = useState();
  const [columnFilters, setColumnFilters] = useState([]);
  const [data, setData] = useState([]);

  const [modalVenta, setModalVenta] = useState(false);
  const [producto, setProducto] = useState("");
  const [tituloModal, setTituloModal] = useState("");
  const [datosVenta, setDatosVenta] = useState([]);

  useEffect(() => {
    cargarVentas();
  }, [modalVenta, fechaDesde, fechaHasta, producto]);

  //Columnas de la tabla Ventas
  const columns = useMemo(() => [
    {
      header: "Empleado",
      accessorKey: "empleado",
      size: 15,
    },
    {
      header: "Fecha y hora",
      accessorKey: "fecha",
      size: 20,
    },
    {
      header: "Total",
      accessorKey: "total",
      size: 20,
    },
  ]);

  const cargarVentas = () => {
    try {
      ConsultasAPI.ListarObjetos(
        URL_VENTA,
        pagination.pageIndex,
        pagination.pageSize,
        columnFilters,
        fechaDesde.fechaMuestra,
        fechaHasta.fechaMuestra,
        producto ? producto : "",
        null, //numero
        null, //categoria
        null //email
      ).then((response) => {
        let ventas = response.data.results;
        setCount(response.data.count);
        if (ventas) {
          let datos = [];
          ventas.forEach((venta) => {
            datos.push({
              id: venta.id,
              empleado: venta.empleado_detalle.email,
              fecha: venta.fecha_creacion
                ? moment(venta.fecha_creacion, "DD/MM/YYYY HH:mm:ss").format(
                    "DD/MM/YYYY HH:mm"
                  )
                : "Fecha no disponible",
              total: "$ " + venta.total,
            });
          });
          setData(datos);
        }
      });
    } catch (error) {
      console.log("Problemas al mostrar ventas", error);
    }
  };

  const handleFechaDesdeChange = (momentDate) => {
    const fechaMuestra = momentDate.format("DD/MM/YYYY");
    const fechaComparar = momentDate.format("YYYY-MM-DD");
    setFechaDesde({
      fechaMuestra: fechaMuestra,
      fechaComparar: fechaComparar,
    });
  };

  const handleFechaHastaChange = (momentDate) => {
    const fechaMuestra = momentDate.format("DD/MM/YYYY");
    const fechaComparar = momentDate.format("YYYY-MM-DD");
    setFechaHasta({
      fechaMuestra: fechaMuestra,
      fechaComparar: fechaComparar,
    });
  };

  const handleCloseModalVenta = () => {
    setDatosVenta([]);
    setModalVenta(false);
  };

  const handleEliminarVenta = async (row) => {
    await Swal.fire({
      title: "Esta seguro de borrar esta venta?",
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
        ConsultasAPI.BorrarObjeto(URL_VENTA, row.id)
          .then((response) => {
            if (response.status === 204) {
              Swal.fire({
                title: "Venta Eliminado Exitosamente",
                text: "Esta acción no se podrá deshacer",
                icon: "success",
              });
            } else {
              Swal.fire({
                title: "Error: problema con la eliminación",
                text: "El Venta no se pudo borrar correctamente",
                icon: "error",
              });
            }
          })
          .then(() => {
            cargarVentas(); // Llamo a cargarTabla después de la eliminación
          });
      }
    });
  };

  const handleEditarVenta = async (row) => {
    const venta = await ConsultasAPI.ObtenerObjeto(URL_VENTA, row.id);
    setDatosVenta(venta.data);

    setTituloModal("Editar");
    setModalVenta(true);
  };

  var limpiarFiltros = function () {
    setProducto("");
    setFechaDesde({ fechaMuestra: null, fechaComparar: null });
    setFechaHasta({ fechaMuestra: null, fechaComparar: null });
    datetimeRefHasta.current.setState({ inputValue: "" });
    datetimeRefDesde.current.setState({ inputValue: "" });
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
          <h2 className="py-2 fw ml-10">Ventas</h2>

          {/* <Button 
            className="btn"
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
            onClick={handleOpenModalAgregarVenta}
          >
            Agregar
          </Button> */}
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
            {/* <Col>
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
            </Col> */}
            <Col
              md={3}
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Button onClick={limpiarFiltros}>Limpiar Filtros</Button>
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
                  {/* {rolUser === "ADMINISTRADOR" ? (
                    <IconButton
                      onClick={() => {
                        handleEditarVenta(row.original);
                      }}
                      title="Editar"
                      variant="outline-info"
                    >
                      <Edit />
                    </IconButton>
                  ) : null} */}
                  {rolUser === "ADMINISTRADOR" ? (
                    <IconButton
                      onClick={() => {
                        handleEliminarVenta(row.original);
                      }}
                      title="Eliminar"
                      variant="outline-info"
                    >
                      <Delete />
                    </IconButton>
                  ) : null}
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
          <Row className="text-center">
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

      <ModalVenta
        onClose={handleCloseModalVenta}
        show={modalVenta}
        tituloModal={tituloModal}
        datosVenta={datosVenta}
      />
    </Container>
  );
};

export default Ventas;
