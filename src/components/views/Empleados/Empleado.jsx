import { Container, Col, Row, Card, Button, Form } from "react-bootstrap";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import ModalCargarEmpleado from "./ModalEmpleado";
import ConsultasAPI from "../../../helpers/consultasAPI";
import { darken, IconButton } from "@mui/material";
import "react-datetime/css/react-datetime.css";
import BtnVolver from "../../common/BtnVolver";

// import moment from "moment";
// import Datetime from "react-datetime";
// import { FaPlus } from "react-icons/fa";
// import { FaEraser } from "react-icons/fa";

const Empleados = (props) => {
  const URL_USUARIOS = window.API_ROUTES.USUARIOS;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [count, setCount] = useState();
  const [columnFilters, setColumnFilters] = useState([]);
  const [data, setData] = useState([]);

  const [modalCargarEmpleados, setModalCargarEmpleados] = useState(false);
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    cargarEmpleados();
  }, [modalCargarEmpleados, email, nombre]);

  const cargarEmpleados = () => {
    try {
      ConsultasAPI.ListarObjetos(
        URL_USUARIOS,
        pagination.pageIndex,
        pagination.pageSize,
        // columnFilters,
        null,
        null,
        null,
        null,
        null,
        null
      ).then((response) => {
        let usuarios = response.data.results;
        setCount(response.data.count);
        console.log(usuarios);
        if (usuarios) {
          let datos = [];
          usuarios.forEach((usuario) => {
            datos.push({
              id: usuario.id,
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              documento: usuario.documento,
              telefono: usuario.telefono,
              email: usuario.email,
              rol: usuario.rol_detalle.nombre,
            });
          });
          setData(datos);
        }
      });
    } catch (error) {
      console.log("Problemas al mostrar cartones no registrados", error);
    }
  };

  //Columnas de la tabla Venta Mostrador
  const columns = useMemo(() => [
    {
      header: "Nombre",
      accessorKey: "nombre",
      size: 15,
    },
    {
      header: "Apellido",
      accessorKey: "apellido",
      size: 20,
    },

    {
      header: "Email",
      accessorKey: "email",
      size: 20,
    },
    {
      header: "Documento",
      accessorKey: "documento",
      size: 20,
    },
    {
      header: "Rol",
      accessorKey: "rol",
      size: 20,
    },
  ]);

  const handleOpenModalAgregarProveedor = () => {
    setModalCargarEmpleados(true);
  };
  const handleCloseModalAgregarProveedor = () => {
    setModalCargarEmpleados(false);
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
          <h2 className="py-2 fw ml-10">Empleados</h2>

          <Button
            className="btn"
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}
            onClick={handleOpenModalAgregarProveedor}
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
                <Form.Label>Nombre:</Form.Label>
                <Form.Control
                  type="text"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value);
                  }}
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group
                style={{
                  alignItems: "center",
                }}
              >
                <Form.Label>Email:</Form.Label>

                <Form.Control
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  required
                />
              </Form.Group>
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

      <ModalCargarEmpleado
        onClose={handleCloseModalAgregarProveedor}
        show={modalCargarEmpleados}
      />
    </Container>
  );
};

export default Empleados;
