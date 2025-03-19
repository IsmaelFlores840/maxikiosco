import React, { useState, useRef, useEffect, useMemo } from "react";
import { Container, Col, Row, Card, Button, Form } from "react-bootstrap";
import "react-datetime/css/react-datetime.css";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import moment from "moment";
import Datetime from "react-datetime";
import BtnVolver from "../../common/BtnVolver";
import ModalCargarProducto from "./ModalCargarProducto";
import ConsultasAPI from "../../../helpers/consultasAPI";

// import { FaPlus } from "react-icons/fa";
// import { FaEraser } from "react-icons/fa";

import { darken, IconButton } from "@mui/material";

const Productos = (props) => {
  const URL_ROL = window.API_ROUTES.ROL;
  const URL_CATEGORIA = window.API_ROUTES.CATEGORIA;

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
  const [estado, setEstado] = useState("");
  const [n, setN] = useState();

  useEffect(() => {
    cargarCategoria();
  }, []);

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
          // console.log(datos);
          setTablaCategoria(datos);
        }
      });
    } catch (error) {
      console.log("Problemas al mostrar cartones no registrados", error);
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
      accessorKey: "Tolal",
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
    setModalCargarProducto(true);
  };
  const handleCloseModalAgregarProducto = () => {
    setModalCargarProducto(false);
  };
  // useEffect(() => {
  //   const currentDate = moment().format("DD/MM/YYYY");
  //   setFecha({ fechaMuestra: currentDate, fechaComparar: null });
  // }, []);

  //Para el botón de limpiar filtro
  // var valid = function (current) {
  //   const today = moment();
  //   const isSunday = current.day() === 0;
  //   return current.isBefore(today) && !isSunday;
  // };

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
                  // readOnly={true}
                  type="text"
                  value={producto}
                  onChange={(e) => {
                    setProducto(e.target.value);
                  }}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          {/* <Col md={9}>
              <Form.Control
                // readOnly={true}
                type="text"
                value={fechaHasta}
                onChange={(e) => {
                  setAhora(e.target.value);
                }}
                required
              />
            </Col> */}

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
              positionActionsColumn="last"
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
      />
    </Container>
  );
};

export default Productos;
