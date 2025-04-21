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

export function ModalEditar(props) {
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [precio, setPrecio] = useState("");
  const [stockActual, setStockActual] = useState("");

  // En ModalEditar.jsx
  const handleSubmit = (event) => {
    event.preventDefault();

    if (cantidad <= 0) {
      Notificaciones.notificacion("La cantidad debe ser mayor a cero");
      return;
    }

    // Crear objeto con los datos actualizados
    const productoActualizado = {
      ...props.datosProducto,
      cantidad: parseInt(cantidad),
      precio_venta: precio, // Actualizar precio total
    };

    // Llamar a la función onSave del padre
    props.onSave(productoActualizado);

    // Cerrar el modal
    props.onClose();
  };

  useEffect(() => {
    if (props.show && props.datosProducto) {
      setNombre(props.datosProducto.nombre || "");
      setPrecio(props.datosProducto.precio_venta || "");
      setStockActual(props.datosProducto.stock || "");
      setCantidad(props.datosProducto.cantidad || 1);
    }
  }, [props.show, props.datosProducto]);

  const handleClose = () => {
    clean();
    props.onClose();
  };

  const clean = () => {
    setNombre("");
    setPrecio("");
    setCantidad("");
    setStockActual("");
  };

  const controlCantidad = (valor) => {
    if (valor > stockActual) {
      Swal.fire({
        title: "Cantidad exedida",
        text: "no hay tanto stock",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      setCantidad("");
    } else {
      const inputValue = valor;
      const cantidadALLevar = inputValue.replace(/\D/g, "");
      setCantidad(cantidadALLevar);
    }
  };

  return (
    <Modal show={props.show} size="xl">
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title> {props.tituloModal} Producto</Modal.Title>
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
                        readOnly={true}
                        required
                      />
                    </Col>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group style={{ alignContent: "center" }}>
                    <Form.Label>Precio:</Form.Label>
                    <Col>
                      <Form.Control
                        type="text"
                        value={precio}
                        readOnly={true}
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
                    <Form.Label>Stock actual:</Form.Label>
                    <Form.Control
                      type="text"
                      value={stockActual}
                      readOnly={true}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Cantidad a llevar:</Form.Label>
                    <Form.Control
                      type="text"
                      value={cantidad}
                      onChange={(e) => {
                        controlCantidad(e.target.value);
                      }}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3" style={{ justifyContent: "center" }}></Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn boton m-3" onClick={handleClose}>
            Cancelar
          </Button>

          <Button className="btn boton m-3" type="submit">
            Aceptar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
export default ModalEditar;
