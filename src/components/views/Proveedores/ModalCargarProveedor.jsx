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

export function ModalCargarProveedor(props) {
  const URL_PROVEEDOR = window.API_ROUTES.PROVEEDOR;

  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (props.tituloModal === "Editar") {
      editarProveedor();
    } else {
      crearProveedor();
    }
  };

  const handleClose = () => {
    clear();
    props.onClose();
  };

  useEffect(() => {
    if (props.datosProveedor) {
      setNombre(props.datosProveedor.nombre ? props.datosProveedor.nombre : "");
      setDireccion(
        props.datosProveedor.direccion ? props.datosProveedor.direccion : ""
      );
      setTelefono(
        props.datosProveedor.telefono ? props.datosProveedor.telefono : ""
      );
      setEmail(props.datosProveedor.email ? props.datosProveedor.email : "");
    }
  }, [props.show]);

  const crearProveedor = async () => {
    try {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email)) {
        Notificaciones.notificacion(
          "Por favor, ingresa un correo electrónico válido. Ejemplo: usuario@dominio.com"
        );
        return;
      }
      await Swal.fire({
        title: "Esta seguro de crear este proveedor?",
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
          const proveedor = {
            nombre: nombre,
            direccion: direccion,
            telefono: telefono,
            email: email,
          };
          ConsultasAPI.CrearObjeto(URL_PROVEEDOR, proveedor).then(
            (response) => {
              if (response.status === 201) {
                Swal.fire({
                  title: "Crecion exitosa",
                  text: "Proveedor generado con exito",
                  icon: "success",
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: "#008185",
                  cancelButtonText: "Aceptar",
                });
              } else {
                Swal.fire({
                  title: "Error",
                  text: "No se pudo crear el proveedor",
                  icon: "error",
                  showCancelButton: true,
                  showConfirmButton: false,
                  cancelButtonColor: "#008185",
                  cancelButtonText: "Aceptar",
                });
              }
              // clear();
            }
          );
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

  const editarProveedor = async () => {
    Swal.fire({
      title: "¿Estás seguro de editar el proveedor?",
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
              id: props.datosProveedor.id,
              nombre: nombre,
              telefono: telefono,
              direccion: direccion,
              email: email,
            },
            usuario: AuthenticationHelper.getUser(),
          };
          const response = await ConsultasAPI.ModificarObjeto(
            URL_PROVEEDOR + "modificarProveedor/",
            props.datosProveedor.id,
            objeto
          );

          if (response.status === 202) {
            Swal.fire(
              "Edición exitosa",
              "Se editó con Éxito el proveedor",
              "success"
            );
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "No se pudo editar con Éxito el proveedor",
            "error"
          );
        }
      }
    });
  };

  const clear = () => {
    setDireccion("");
    setNombre("");
    setTelefono("");
    setEmail("");
  };

  return (
    <Modal show={props.show} size="xl">
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title> {props.tituloModal} Proveedor</Modal.Title>
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
                  <Form.Group style={{ alignContent: "center" }}>
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
              </Row>
              <Row className="mb-3">
                <Col>
                  <Form.Group
                    style={{ alignContent: "center", justifyContent: "center" }}
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
              <Row className="mb-3" style={{ justifyContent: "center" }}>
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
            {props.tituloModal === "Editar" ? "Editar" : "Crear"} Proveedor
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
export default ModalCargarProveedor;
