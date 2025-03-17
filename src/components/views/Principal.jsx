import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import OpcionInicio from "./OpcionInicio";
import { Container, Card, Row, Col } from "react-bootstrap";

const Principal = (props) => {
  const rolUser = props.rolUsuario;

  return (
    <Container className="mainSection">
      <Row className="auto mt-5">
        {rolUser === "ADMINISTRADOR" ||
        rolUser === "GERENCIA-QUINIELA" ||
        rolUser === "CONSULTOR" ? (
          <>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OpcionInicio
                // imagen={
                //   require()
                //   // "../../img/MenuPrincipal/Usuarios.png"
                // }
                texto={"Punto de Venta"}
                ruta={"/punto-de-venta"} // modificar
              />
            </Col>
          </>
        ) : null}
        {rolUser === "ADMINISTRADOR" ? (
          <>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OpcionInicio
                // imagen={require("../../img/MenuPrincipal/Titulares.png")}
                texto={"Gestión de Productos"}
                ruta={"/titulares"}
              />
            </Col>
          </>
        ) : null}
        {rolUser === "ADMINISTRADOR" ? (
          <>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OpcionInicio
                // imagen={require("../../img/MenuPrincipal/Agencias.png")}
                texto={"Gestión de Proveedores"}
                ruta={"/agencias"}
              />
            </Col>
          </>
        ) : null}
        {rolUser === "ADMINISTRADOR" ? (
          <>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OpcionInicio
                // imagen={require("../../img/MenuPrincipal/Liquidacion.png")}
                texto={"Gestión de Ventas"}
                ruta={"/liquidaciones"}
              />
            </Col>
          </>
        ) : null}
        {rolUser === "ADMINISTRADOR" ||
        rolUser === "GERENCIA-QUINIELA" ||
        rolUser === "CONSULTOR" ? (
          <>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OpcionInicio
                // imagen={require("../../img/MenuPrincipal/SubirExtracto.png")}
                texto={"Gestión de Clientes"}
                ruta={"/extractos"}
              />
            </Col>
          </>
        ) : null}
        {rolUser === "ADMINISTRADOR" ? (
          <>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OpcionInicio
                // imagen={require("../../img/MenuPrincipal/logotuqui.png")}
                texto={"Gestión de Empleados"}
                ruta={"/tuqui"}
              />
            </Col>
          </>
        ) : null}
        {rolUser === "ADMINISTRADOR" ? (
          <>
            <Col
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <OpcionInicio
                // imagen={require("../../img/MenuPrincipal/SubirExtracto.png")}
                texto={"Reportes"}
                ruta={"/subirImgExtracto"}
              />
            </Col>
          </>
        ) : null}
      </Row>
    </Container>
  );
};

export default Principal;
