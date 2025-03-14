import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import { FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import "../../App.css";
import LoginApi from "./api/LoginApi";
import React, { useEffect } from "react";
import AuthenticationHelper from "../../helpers/authenticationHelper";
import Notificaciones from "../../helpers/notificacionesToast";

import { Toaster } from "react-hot-toast";

const LoginForm = (props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function loginAcceder(values) {
    LoginApi.Login(values.email, values.password)
      .then((response) => {
        if (!response.data.rol) {
          Notificaciones.notificacion("El usuario no posee un rol");
          AuthenticationHelper.logout();
        } else if (response.data.has_changed_password) {
          // Si el usuario ha cambiado su clave, permitir el acceso a las rutas
          // que corresponden a su rol
          props.onLogin(values.email, true, response.data.rol);
          // navigate("/");
        } else {
          // Si el usuario no ha cambiado su clave, redirigir a la ventana de cambio de clave
          props.onLogin(values.email, false, response.data.rol);
          // navigate("/cambiar-clave");
          // <CambiarClave rolUsuario={rolUser}/>
        }
      })
      .catch((error) => {
        Notificaciones.notificacion("No se pudo establecer la conexión");
      });
  }

  return (
    <Container className="mainSection my-5">
      <Toaster />
      <section>
        <Row className="d-flex justify-content-center g-0">
          <Col md="6">
            <Card className="d-flex justify-content-center">
              <Row className="d-flex justify-content-center">
                <Col className="d-flex justify-content-center align-items-center m-3">
                  <div>
                    <span className="h1 fw-bold">
                      <FaSignInAlt size={50} style={{ color: "#F15E21" }} />{" "}
                      Maxikiosco
                    </span>
                    <Form
                      className="my-2"
                      onSubmit={handleSubmit(loginAcceder)}
                      style={{ width: "max-content" }}
                    >
                      <Form.Group className="mb-3">
                        <Form.Label className="fs-4">Usuario</Form.Label>
                        <Form.Control
                          type="email"
                          autoComplete="off" // Deshabilitar autocompletado para este campo
                          placeholder="Ingrese su correo electrónico"
                          style={{ width: "400px" }} //Ajusta el valor de 'width' según tus preferencias
                          {...register("email", {
                            required: "El nombre de usuario es obligatorio",
                            minLength: {
                              value: 2,
                              message:
                                "La cantidad minima de caracteres debe ser 2",
                            },
                            maxLength: {
                              value: 100,
                              message:
                                "La cantidad maxima de caracteres debe ser 100",
                            },
                          })}
                        />
                        <Form.Text className="text-danger">
                          {errors.descripcion?.message}
                        </Form.Text>
                      </Form.Group>
                      <Form.Group
                        className="mb-3"
                        controlId="formBasicPassword"
                      >
                        <Form.Label className="fs-4">Contraseña</Form.Label>
                        <Form.Control
                          type="password"
                          autoComplete="off" // Deshabilitar autocompletado para este campo
                          placeholder="Ingrese su contraseña"
                          {...register("password", {
                            required: "Debe ingresar una contraseña",
                            minLength: {
                              value: 2,
                              message:
                                "La cantidad minima de caracteres debe ser 2",
                            },
                            maxLength: {
                              value: 100,
                              message:
                                "La cantidad maxima de caracteres debe ser 100",
                            },
                          })}
                        />
                        <Form.Text className="text-danger">
                          {errors.descripcion?.message}
                        </Form.Text>
                      </Form.Group>
                      <Form.Group className="mb-3 d-flex justify-content-between align-items-center">
                        <Form.Check type="checkbox" id="recordarme">
                          <Form.Check.Input />
                          <Form.Check.Label style={{ fontSize: "12px" }}>
                            RECORDARME
                          </Form.Check.Label>
                        </Form.Check>
                        {/* <Link
                          to="/recuperar-clave"
                          className="red-link"
                          style={{ fontSize: "12px" }}
                        >
                          OLVIDÉ MI CONTRASEÑA
                        </Link> */}
                      </Form.Group>
                      <section className="d-flex justify-content-center mb-3">
                        <Button className="boton fw-bold" type="submit">
                          Iniciar Sesión
                        </Button>
                      </section>
                    </Form>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </section>
    </Container>
  );
};
export default LoginForm;
