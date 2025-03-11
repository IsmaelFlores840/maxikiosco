import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Navbar,
  Container,
  Nav,
  NavDropdown,
  InputGroup,
  Modal,
  Button,
} from "react-bootstrap";
// import {  Form, Button, Card, Row, Col } from "react-bootstrap";
import AuthHelper from "../../helpers/authenticationHelper";
import { useState } from "react";
// import { Modal, Form, Button, Label } from "react-bootstrap";
// import axios from "axios";
import {
  // toast,
  Toaster,
} from "react-hot-toast";
// import Notificaciones from "../../shared/helpers/notificacionesToast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
// import CambiarClaveAPI from "../helpers/cambiarClaveAPI";
// import { resetWarned } from "react-bootstrap-typeahead/types/utils/warn";

const Menu = (props) => {
  const user = props.user;
  const cambioClave = props.cambioClave;
  const navigate = useNavigate();
  const logOut = () => {
    AuthHelper.logout(() => {
      props.onLogout(); // Actualiza el estado de autenticación en el componente App
      navigate("/login"); // Redirecciona al componente de inicio de sesión
    });
  };
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <Navbar
      className="d-flex justify-content-space-around"
      style={{ backgroundColor: "#DDDDDD" }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={require("../../img/cheffs-logo.png")}
            alt="Logo Cheffs"
            style={{ width: "50px" }}
          ></img>
          <Form.Label
            className=" h5 fw-bold  justify-content-space-around"
            style={{ paddingLeft: "20px" }}
          >
            {" "}
            Maxikiosco cheffs
          </Form.Label>
        </Navbar.Brand>
        {user ? (
          <Nav className="col-sm-12 col-lg-2">
            <NavDropdown
              title={AuthHelper.getUser()}
              id="basic-nav-dropdown"
              align="end"
              className="fs-6 fw-bold "
              style={{ width: "200px", whiteSpace: "nowrap" }}
            >
              {cambioClave ? (
                <NavDropdown.Item onClick={handleOpenModal}>
                  Cambiar Clave
                </NavDropdown.Item>
              ) : null}
              <NavDropdown.Item onClick={logOut}>
                Cerrar sesion
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        ) : null}
      </Container>
      <ChangePasswordModal
        show={showModal}
        onClose={handleCloseModal}
        onLogout={props.onLogout}
      />
      <Toaster />
    </Navbar>
  );
};

export default Menu;

export function ChangePasswordModal(props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //  States para mostrar claves
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowconfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const logOut = () => {
    AuthHelper.logout(() => {
      // Utiliza la prop onLogout en lugar de props.onLogout
      props.onLogout(); // Actualiza el estado de autenticación en el componente App
      navigate("/login"); // Redirecciona al componente de inicio de sesión
    });
  };

  const handleClose = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
    props.onClose();
  };

  const handleClickCurrentPassword = () =>
    setShowCurrentPassword(!showCurrentPassword);
  const handleClickNewPassword = () => setShowNewPassword(!showNewPassword);
  const handleClickConfirmPassword = () =>
    setShowconfirmPassword(!showConfirmPassword);

  // const handleChangePassword = async (event) => {
  //   let resultado = 0;
  //   const token = localStorage.getItem("token");
  //   const email = AuthHelper.getUser();
  //   event.preventDefault();
  //   // Devuelve 0 si hay alguna inconsistencia
  //   CambiarClaveAPI(
  //     email,
  //     newPassword,
  //     confirmPassword,
  //     props.onLogout,
  //     setMessage,
  //     currentPassword
  //   ).then((resultado) => {
  //     if (resultado !== 0) {
  //       handleClose();
  //     }
  //   });
  // };

  return (
    <Modal show={props.show}>
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title>Cambiar Clave</Modal.Title>
      </Modal.Header>
      <Form
      // onSubmit={handleChangePassword}
      >
        <Modal.Body>
          {/* CLAVE ACTUAL */}
          <Form.Group controlId="currentPassword">
            <Form.Label>Clave actual:</Form.Label>
            <InputGroup>
              <Form.Control
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                autoComplete="off" // Deshabilitar autocompletado para este campo
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
              />
              <Button
                variant="link"
                type="button"
                onClick={handleClickCurrentPassword}
              >
                {showCurrentPassword ? (
                  <FaEyeSlash title="Ocultar clave" color="#777777" />
                ) : (
                  <FaEye title="Mostrar clave" color="#777777" />
                )}
              </Button>
            </InputGroup>
          </Form.Group>
          {/* NUEVA CLAVE */}
          <Form.Group controlId="newPassword">
            <Form.Label>Nueva clave:</Form.Label>
            <InputGroup>
              <Form.Control
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                autoComplete="off" // Deshabilitar autocompletado para este campo
                onChange={(event) => setNewPassword(event.target.value)}
                required
              />
              <Button
                variant="link"
                type="button"
                onClick={handleClickNewPassword}
              >
                {showNewPassword ? (
                  <FaEyeSlash title="Ocultar clave" color="#777777" />
                ) : (
                  <FaEye title="Mostrar clave" color="#777777" />
                )}
              </Button>
            </InputGroup>
          </Form.Group>
          {/* CONFIRMACION CLAVE ACTUAL  */}
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirma nueva clave:</Form.Label>
            <InputGroup>
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                autoComplete="off" // Deshabilitar autocompletado para este campo
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
              <Button
                variant="link"
                type="button"
                onClick={handleClickConfirmPassword}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash title="Ocultar clave" color="#777777" />
                ) : (
                  <FaEye title="Mostrar clave" color="#777777" />
                )}
              </Button>
            </InputGroup>
          </Form.Group>
          <p
            style={{ marginTop: "1rem", color: "#777777", fontSize: "0.8rem" }}
          >
            La nueva contraseña debe tener al menos 8 caracteres, una mayúscula,
            y contener al menos un número.
          </p>
          {message && (
            <div className={`alert alert-${message.variant} my-4`} role="alert">
              {message.text}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button className="boton" onClick={handleClose}>
            Cancelar
          </Button>
          <Button className="boton" type="submit">
            Cambiar password
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
