import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Navbar, Container } from "react-bootstrap";
import { Toaster } from "react-hot-toast";

const Menu = (props) => {
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
      </Container>
      <Toaster />
    </Navbar>
  );
};

export default Menu;
