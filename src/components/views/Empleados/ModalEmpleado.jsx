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
// import Datetime from "react-datetime";
// import { MRT_Localization_ES } from "material-react-table/locales/es";
// import moment from "moment";
import Notificaciones from "../../../helpers/notificacionesToast";
import ConsultasAPI from "../../../helpers/consultasAPI";
import "react-datetime/css/react-datetime.css";
import Swal from "sweetalert2";

export function ModalEmpleado(props) {
  const URL_EMPLEADO = window.API_ROUTES.EMPLEADO;
  const URL_ROL = window.API_ROUTES.ROL;

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasenia, setContrasenia] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    crearProveedor();
  };

  const handleClose = () => {
    clear();
    props.onClose();
  };

  const crearProveedor = async () => {
    try {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(email)) {
        Notificaciones.notificacion(
          "Por favor, ingresa un correo electrónico válido. Ejemplo: usuario@dominio.com"
        );
        return;
      }
      const empleado = {
        nombre: nombre,
        direccion: direccion,
        telefono: telefono,
        email: email,
      };
      await ConsultasAPI.CrearObjeto(URL_EMPLEADO, empleado).then(
        (response) => {
          Swal.fire({
            title: "Crecion exitosa",
            text: "Empleado generado con exito",
            icon: "success",
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonColor: "#008185",
            cancelButtonText: "Aceptar",
          });
          clear();
        }
      );
    } catch (error) {
      if (error.response && error.response.data && error.response.data.email) {
        Notificaciones.notificacion(
          "Error: Correo electrónico inválido. Verifique los campos."
        );
      } else {
        Notificaciones.notificacion("Error inesperado. Intente nuevamente.");
      }
    }
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
        <Modal.Title> Cargar Empleado</Modal.Title>
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
                    <Form.Label>Apellido:</Form.Label>
                    <Col>
                      <Form.Control
                        type="text"
                        value={apellido}
                        onChange={(e) => {
                          setApellido(e.target.value);
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
                    style={{
                      alignContent: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Form.Label>Rol:</Form.Label>
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
              <Row className="mb-3" style={{ justifyContent: "center" }}>
                <Col>
                  <Form.Group>
                    <Form.Label>Dirección:</Form.Label>
                    <Form.Control
                      type="text"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)}
                    />
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
                    <Form.Label>Contraseña:</Form.Label>
                    <Form.Control
                      type="text"
                      value={contrasenia}
                      onChange={(e) => setContrasenia(e.target.value)}
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
            Alta Empleado
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
export default ModalEmpleado;
