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
import AuthenticationHelper from "../../../helpers/authenticationHelper";
import Notificaciones from "../../../helpers/notificacionesToast";
import ConsultasAPI from "../../../helpers/consultasAPI";
import "react-datetime/css/react-datetime.css";
import Swal from "sweetalert2";

export function ModalCliente(props) {
  const URL_CLIENTE = window.API_ROUTES.CLIENTE;

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [apellido, setApellido] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (props.tituloModal === "Editar") {
      editarCliente();
    } else {
      crearCliente();
    }
  };

  const handleClose = () => {
    clear();
    props.onClose();
  };

  useEffect(() => {
    if (props.datosCliente) {
      setNombre(props.datosCliente.nombre ? props.datosCliente.nombre : "");
      setDireccion(
        props.datosCliente.direccion ? props.datosCliente.direccion : ""
      );
      setTelefono(
        props.datosCliente.telefono ? props.datosCliente.telefono : ""
      );
      setApellido(
        props.datosCliente.apellido ? props.datosCliente.apellido : ""
      );
    }
  }, [props.show]);

  const crearCliente = async () => {
    try {
      await Swal.fire({
        title: "Esta seguro de crear este cliente?",
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
          const cliente = {
            nombre: nombre,
            apellido: apellido,
            direccion: direccion,
            telefono: telefono,
          };
          ConsultasAPI.CrearObjeto(URL_CLIENTE, cliente).then((response) => {
            if (response.status === 201) {
              Swal.fire({
                title: "Crecion exitosa",
                text: "Cliente generado con exito",
                icon: "success",
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonColor: "#008185",
                cancelButtonText: "Aceptar",
              });
            } else {
              Swal.fire({
                title: "Error",
                text: "No se pudo crear el cliente",
                icon: "error",
                showCancelButton: true,
                showConfirmButton: false,
                cancelButtonColor: "#008185",
                cancelButtonText: "Aceptar",
              });
            }
            // clear();
          });
        }
      });
    } catch (error) {
      // Captura el error y muestra una notificación
      // Verifica si el error es debido a un correo inválido
      if (error.response && error.response.data && error.response.data.email) {
        Notificaciones.notificacion(
          "Error: Correo electrónico inválido. Verifique los campos."
        );
      } else {
        Notificaciones.notificacion("Error inesperado. Intente nuevamente.");
      }
    }
  };

  const editarCliente = async () => {
    Swal.fire({
      title: "¿Estás seguro de editar el cliente?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#008185",
      cancelButtonColor: "#EC1B23",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let objeto;
          objeto = {
            user: {
              id: props.datosCliente.id,
              nombre: nombre,
              telefono: telefono,
              direccion: direccion,
              apellido: apellido,
            },
            usuario: AuthenticationHelper.getUser(),
          };
          const response = await ConsultasAPI.ModificarObjeto(
            URL_CLIENTE + "modificarCliente/",
            props.datosCliente.id,
            objeto
          );

          if (response.status === 202) {
            Swal.fire(
              "Edición exitosa",
              "Se editó con Éxito el cliente",
              "success"
            );
          }
        } catch (error) {
          Swal.fire("Error", "No se pudo editar con Éxito el cliente", "error");
        }
      }
    });
  };

  const clear = () => {
    setDireccion("");
    setNombre("");
    setTelefono("");
    setApellido("");
  };

  return (
    <Modal show={props.show} size="xl">
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title> {props.tituloModal} Cliente</Modal.Title>
      </Modal.Header>
      <Form
        onSubmit={handleSubmit}
        // onKeyDown={handleFormKeyDown}
        style={{ width: "100%" }}
      >
        <Modal.Body style={{ width: "100%" }}>
          <Card className="m-3">
            <Card.Body className="mb-7">
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
                        onChange={(e) => {
                          setNombre(e.target.value);
                        }}
                        required
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group
                    style={{ alignContent: "center", justifyContent: "center" }}
                  >
                    <Form.Label>Apellido:</Form.Label>
                    <Form.Control
                      type="text"
                      value={apellido}
                      onChange={(e) => {
                        setApellido(e.target.value);
                      }}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Group>
                    <Form.Label>Teléfono:</Form.Label>
                    <Col>
                      <Form.Control
                        type="text"
                        value={telefono}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const precioVenta = inputValue.replace(/\D/g, "");
                          setTelefono(precioVenta);
                        }}
                        required
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Dirección:</Form.Label>
                    <Form.Control
                      type="text"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn boton m-3" onClick={handleClose}>
            Cancelar
          </Button>

          <Button className="btn boton m-3" type="submit">
            {props.tituloModal === "Editar" ? "Editar" : "Crear"} Cliente
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
export default ModalCliente;
