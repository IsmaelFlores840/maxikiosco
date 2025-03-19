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
        rolUser === "PROVEEDOR" ||
        rolUser === "EMPLEADO" ? (
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
                ruta={"/Punto-venta"} // modificar
              />
            </Col>
          </>
        ) : null}
        {rolUser === "ADMINISTRADOR" ||
        rolUser === "PROVEEDOR" ||
        rolUser === "EMPLEADO" ? (
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
                ruta={"/Gestion-productos"}
              />
            </Col>
          </>
        ) : null}
        {rolUser === "ADMINISTRADOR" ||
        rolUser === "PROVEEDOR" ||
        rolUser === "EMPLEADO" ? (
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
                ruta={"/Gestion-proveedores"}
              />
            </Col>
          </>
        ) : null}
        {rolUser === "ADMINISTRADOR" ||
        rolUser === "PROVEEDOR" ||
        rolUser === "EMPLEADO" ? (
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
                ruta={"/Gestion-ventas"}
              />
            </Col>
          </>
        ) : null}
        {rolUser === "ADMINISTRADOR" ||
        rolUser === "PROVEEDOR" ||
        rolUser === "EMPLEADO" ? (
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
                ruta={"/Gestion-clientes"}
              />
            </Col>
          </>
        ) : null}
        {rolUser === "ADMINISTRADOR" ||
        rolUser === "PROVEEDOR" ||
        rolUser === "EMPLEADO" ? (
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
                ruta={"/Gestion-empleados"}
              />
            </Col>
          </>
        ) : null}
        {rolUser === "ADMINISTRADOR" ||
        rolUser === "PROVEEDOR" ||
        rolUser === "EMPLEADO" ? (
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
                ruta={"/Reportes"}
              />
            </Col>
          </>
        ) : null}
      </Row>
    </Container>
  );
};

export default Principal;
