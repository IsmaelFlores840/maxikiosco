// import React from "react";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import { FaSignInAlt } from "react-icons/fa";
import { useNavigate } from "react-router";
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import LoginApi from "./api/LoginApi";
import cliente from "../../../img/logo-quiniela.png";
import React, { useEffect } from "react";
import AuthenticationHelper from "../../../shared/helpers/authenticationHelper";
import Notificaciones from '../../../shared/helpers/notificacionesToast';
import PasswordResetForm from "./PasswordResetForm";

import toast, { Toaster } from "react-hot-toast";
import CambiarClave from "./CambiarClave";

const LoginForm = (props) => {
  const navigate = useNavigate();

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
          <Col md="8">
            <Card className="d-flex justify-content-center">
              <Row className="d-flex justify-content-center">
                <Col md="5" className="d-flex justify-content-center align-items-center">
                  <Card.Img
                    style={{ width: "80%", height: "auto" }}
                    src={cliente}
                  />
                </Col>
                <Col md="5" className="d-flex justify-content-center align-items-center m-3">
                  <div>
                    <span className="h1 fw-bold">
                      <FaSignInAlt size={50} style={{ color: "#F15E21" }} />{" "}
                      Juegos CPA
                    </span>
                    <Form className="my-2" onSubmit={handleSubmit(loginAcceder)}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fs-4">Usuario</Form.Label>
                        <Form.Control
                          type="email"
                          autoComplete="off" // Deshabilitar autocompletado para este campo
                          placeholder="Ingrese su correo electrónico"
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
                      <Form.Group className="mb-3 text-center">
                        <Link to="/recuperar-clave">¿Olvidaste tu contraseña?</Link>
                      </Form.Group>
                      <section className="d-flex justify-content-center mb-3">
                        <Button className="botonCPA fw-bold" type="submit">
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
