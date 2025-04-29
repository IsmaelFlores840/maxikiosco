import { Container, Col, Row, Card, Button, Form } from "react-bootstrap";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import ModalCargarProveedor from "./ModalCargarProveedor";
import ConsultasAPI from "../../../helpers/consultasAPI";
import "react-datetime/css/react-datetime.css";
import BtnVolver from "../../common/BtnVolver";
import { Edit, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";

import { darken, IconButton } from "@mui/material";

const Proveedores = (props) => {
  const rolUser = props.rolUsuario;
  const URL_PROVEEDOR = window.API_ROUTES.PROVEEDOR;
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [count, setCount] = useState();
  const [columnFilters, setColumnFilters] = useState([]);
  const [data, setData] = useState([]);

  const [modalCargarProveedor, setModalCargarProveedor] = useState(false);
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [tituloModal, setTituloModal] = useState("");
  const [datosProveedor, setDatosProveedor] = useState([]);

  useEffect(() => {
    cargarProveedores();
  }, [modalCargarProveedor, email, nombre]);

  const cargarProveedores = () => {
    try {
      ConsultasAPI.ListarObjetos(
        URL_PROVEEDOR,
        pagination.pageIndex,
        pagination.pageSize,
        columnFilters,
        null,
        null,
        nombre ? nombre : "",
        null,
        null,
        email ? email : ""
      ).then((response) => {
        let proveedores = response.data.results;
        setCount(response.data.count);
        if (proveedores) {
          let datos = [];
          proveedores.forEach((proveedor) => {
            datos.push({
              id: proveedor.id,
              nombre: proveedor.nombre,
              direccion: proveedor.direccion,
              telefono: proveedor.telefono,
              email: proveedor.email,
            });
          });
          setData(datos);
        }
      });
    } catch (error) {
      console.log("Problemas al mostrar proveedores", error);
    }
  };

  //Columnas de la tabla Poveedores
  const columns = useMemo(() => [
    {
      header: "Nombre",
      accessorKey: "nombre",
      size: 15,
    },
    {
      header: "Teléfono",
      accessorKey: "telefono",
      size: 20,
    },
    {
      header: "Dirección",
      accessorKey: "direccion",
      size: 20,
    },
    {
      header: "Email",
      accessorKey: "email",
      size: 20,
    },
  ]);

  const handleOpenModalAgregarProveedor = () => {
    setTituloModal("Agregar");
    setModalCargarProveedor(true);
  };
  const handleCloseModalAgregarProveedor = () => {
    setDatosProveedor([]);
    setModalCargarProveedor(false);
  };

  const handleEliminarProveedor = async (row) => {
    await Swal.fire({
      title: "Esta seguro de borrar este proveedor?",
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
        ConsultasAPI.BorrarObjeto(URL_PROVEEDOR, row.id)
          .then((response) => {
            if (response.status === 204) {
              Swal.fire({
                title: "Proveedor Eliminado Exitosamente",
                text: "Esta acción no se podrá deshacer",
                icon: "success",
              });
            } else {
              Swal.fire({
                title: "Error: problema con la eliminación",
                text: "El Proveedor no se pudo borrar correctamente",
                icon: "error",
              });
            }
          })
          .then(() => {
            cargarProveedores(); // Llamo a cargarTabla después de la eliminación
          });
      }
    });
  };

  const handleEditarProveedor = async (row) => {
    const proveedor = await ConsultasAPI.ObtenerObjeto(URL_PROVEEDOR, row.id);
    setDatosProveedor(proveedor.data);

    setTituloModal("Editar");
    setModalCargarProveedor(true);
  };

  var limpiarFiltros = function () {
    setNombre("");
    setEmail("");
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
          <h2 className="py-2 fw ml-10">Proveedores</h2>

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
                  <IconButton
                    onClick={() => {
                      handleEditarProveedor(row.original);
                    }}
                    title="Editar"
                    variant="outline-info"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      handleEliminarProveedor(row.original);
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

      <ModalCargarProveedor
        onClose={handleCloseModalAgregarProveedor}
        show={modalCargarProveedor}
        tituloModal={tituloModal}
        datosProveedor={datosProveedor}
      />
    </Container>
  );
};

export default Proveedores;
