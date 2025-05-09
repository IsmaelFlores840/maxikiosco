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
import AuthenticationHelper from "../../../helpers/authenticationHelper";
import Notificaciones from "../../../helpers/notificacionesToast";
import ConsultasAPI from "../../../helpers/consultasAPI";
import "react-datetime/css/react-datetime.css";
import Swal from "sweetalert2";

export function ModalEmpleado(props) {
  const URL_EMPLEADO = window.API_ROUTES.EMPLEADO;
  const URL_ROL = window.API_ROUTES.ROL;

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [documento, setDocumento] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState("");
  const [tablaRoles, setTablaRoles] = useState([]);
  // const [usuario, setUsuario] = useState("");
  // const [contrasenia, setContrasenia] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (props.tituloModal === "Editar") {
      editarEmpleado();
    } else {
      crearEmpleado();
    }
  };

  const handleClose = () => {
    clear();
    props.onClose();
  };

  useEffect(() => {
    cargarRol();
    if (props.datosEmpleado) {
      // cargamos los datos en caso de que se quiera editar el empleado
      setNombre(props.datosEmpleado.nombre ? props.datosEmpleado.nombre : "");
      setApellido(
        props.datosEmpleado.apellido ? props.datosEmpleado.apellido : ""
      );
      setDocumento(
        props.datosEmpleado.documento ? props.datosEmpleado.documento : ""
      );
      setEmail(props.datosEmpleado.email ? props.datosEmpleado.email : "");
      setRol(
        props.datosEmpleado.rol_detalle ? props.datosEmpleado.rol_detalle : ""
      );
    }
  }, [props.show]);

  const crearEmpleado = async () => {
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
        apellido: apellido,
        documento: documento,
        email: email,
        // contrasenia: contrasenia,
        // rol: rol,
      };
      await ConsultasAPI.CrearObjeto(URL_EMPLEADO, empleado).then(() => {
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
      });
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

  const editarEmpleado = async () => {
    Swal.fire({
      title: "¿Estás seguro de editar el Empleado?",
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
              id: props.datosEmpleado.id,
              nombre: nombre,
              apellido: apellido,
              documento: documento,
              email: email,
              // contrasenia: contrasenia,
              rol: rol,
            },
            usuario: AuthenticationHelper.getUser(),
          };
          const response = await ConsultasAPI.ModificarObjeto(
            URL_EMPLEADO + "modificarEmpleado/",
            props.datosEmpleado.id,
            objeto
          );

          if (response.status === 202) {
            Swal.fire(
              "Edición exitosa",
              "Se editó con Éxito el empleado",
              "success"
            );
          }
        } catch (error) {
          Swal.fire(
            "Error",
            "No se pudo editar con Éxito el empleado",
            "error"
          );
        }
      }
    });
  };

  const cargarRol = () => {
    try {
      ConsultasAPI.ListarObjetos(URL_ROL).then((response) => {
        let roles = response.data.results;
        if (roles) {
          let datos = [];
          roles.forEach((rol) => {
            datos.push({
              id: rol.id,
              nombre: rol.nombre,
            });
          });
          setTablaRoles(datos);
        }
      });
    } catch (error) {
      console.log("Problemas al mostrar los roles", error);
    }
  };

  const handleTablaRolesChange = (rol) => {
    setRol(tablaRoles.filter((x) => x.id === parseInt(rol))[0]);
  };

  const clear = () => {
    setNombre("");
    setDocumento("");
    setEmail("");
    setApellido("");
  };

  return (
    <Modal show={props.show} size="xl">
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title> {props.tituloModal} Empleado</Modal.Title>
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
                      <Form.Select
                        value={rol ? rol.id : ""}
                        onChange={(event) => {
                          handleTablaRolesChange(event.target.value);
                        }}
                        required
                      >
                        <option hidden>Elegir Rol</option>
                        {tablaRoles.length > 0
                          ? tablaRoles.map((rol) => (
                              <option key={rol.id} value={rol.id}>
                                {rol.nombre}
                              </option>
                            ))
                          : null}
                      </Form.Select>
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group style={{ alignContent: "center" }}>
                    <Form.Label>Documento:</Form.Label>
                    <Col>
                      <Form.Control
                        type="text"
                        value={documento}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const precioVenta = inputValue.replace(/\D/g, "");
                          setDocumento(precioVenta);
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
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn boton m-3" onClick={handleClose}>
            Cancelar
          </Button>
          {props.tituloModal === "Editar" ? (
            <Button className="btn boton m-3" type="submit">
              {props.tituloModal} Empleado
            </Button>
          ) : (
            <Button className="btn boton m-3" type="submit">
              Alta Empleado
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
export default ModalEmpleado;
