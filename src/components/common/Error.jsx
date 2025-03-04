import React from "react";
import "../../App.css";
import { Container, Row } from "react-bootstrap";
import BtnVolver from "../common/BtnVolver";

const Error = () => {
  return (
    <Container
      className="mainSection"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Row>
        <h1 className="text-center m-3">Pagina no encontrada</h1>
      </Row>
      <Row>
        <BtnVolver />
      </Row>
    </Container>
  );
};

export default Error;
