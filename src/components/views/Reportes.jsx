import React, { useState, useRef, useEffect, useMemo } from "react";
import { Container, Col, Row, Card, Button, Form } from "react-bootstrap";
import "react-datetime/css/react-datetime.css";
import { MaterialReactTable } from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import moment from "moment";
import BtnVolver from "../common/BtnVolver";
// import { FaPlus } from "react-icons/fa";
// import ModalGenerarCartones from "./ModalGenerarCartones";
// import { FaEraser } from "react-icons/fa";

import { darken, IconButton } from "@mui/material";

const Reportes = () => {
  const [count, setCount] = useState();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [fecha, setFecha] = useState({
    fechaMuestra: null,
    fechaComparar: null,
  });
  const [columnFilters, setColumnFilters] = useState([]);
  const [data, setData] = useState([]);
  const [tipoCategoria, setTipoCategoria] = useState("");
  const [tablaTipoCategoria, setTablaTipoCategoria] = useState([]);

  useEffect(() => {
    cargarTablaCategoria();
  }, []);

  // useEffect(() => {
  //   console.log(tipoVenta);
  // }, []);

  const handleTablaCategoriaChange = (categoria) => {
    setTipoCategoria(tablaTipoCategoria.filter((x) => x.id === categoria)[0]);
  };

  const cargarTablaCategoria = () => {
    let tipoCategoria = [];
    tipoCategoria.push({
      id: 1,
      detalle: "Categoria 1",
    });
    tipoCategoria.push({
      id: 2,
      detalle: "Categoria 2",
    });
    tipoCategoria.push({
      id: 2,
      detalle: "Categoria 3",
    });

    setTablaTipoCategoria(tipoCategoria);
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

  useEffect(() => {
    const currentDate = moment().format("DD/MM/YYYY");
    setFecha({ fechaMuestra: currentDate, fechaComparar: null });
  }, []);

  //Para el botón de limpiar filtro
  // var valid = function (current) {
  //   const today = moment();
  //   const isSunday = current.day() === 0;
  //   return current.isBefore(today) && !isSunday;
  // };

  return (
    <Container className="mt-4 mb-4">
      <Card>
        <Card.Header>
          <h2 className="py-2 fw ml-10">Reportes</h2>
          {/* Venta Mostrador */}
        </Card.Header>
        <Card.Body className="mb-13" style={{ paddingBottom: 0 }}>
          {/* <Card className="mb-13"> */}
          {/* <Form.Group
              md="3"
              style={{ alignContent: "center", justifyContent: "center" }}
            >
              <Form.Label>Fecha Hasta:</Form.Label>
              <Col md={9}>
                <Form.Control
                  // readOnly={true}
                  type="text"
                  value={ahora}
                  onChange={(e) => {
                    setAhora(e.target.value);
                  }}
                  required
                />
              </Col>
            </Form.Group> */}

          <Card className="mb-13">
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
                columnVisibility: { id_sorteo: false }, //hide firstName column by default
                showColumnFilters: true,
              }}
              editingMode="modal" //default
              enableRowSelection={false} //enable some features
              enableColumnOrdering={false}
              enableHiding={false}
              enableColumnActions={false}
              enableSorting={false}
              displayColumnDefOptions={{ "mrt-row-actions": { size: 10 } }} //change width of actions column to 300px
              enableGlobalFilter={true} //turn off a feature
              enableFilters={false}
              localization={MRT_Localization_ES}
              positionActionsColumn="last"
              manualPagination
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
              {/* <Button className="btn botonCPA me-3" route="/tuqui/Vendedores"> Ingresar</Button> */}
              {/* <button
                className="btn botonCPA me-3"
                style={{ float: "right" }}
                onClick={() => {
                  //funcion para imprimir
                }}
              >
                Ingresar
              </button> */}
            </section>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Reportes;
