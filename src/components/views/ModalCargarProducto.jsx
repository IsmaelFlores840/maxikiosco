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
import "react-datetime/css/react-datetime.css";
import ConsultasAPI from "../../helpers/consultasAPI";
import moment from "moment";
import Swal from "sweetalert2";

export function ModalCargarProducto(props) {
  const URL_PRODUCTO = window.API_ROUTES.PRODUCTO;
  const URL_CATEGORIA = window.API_ROUTES.CATEGORIA;
  const URL_PROVEEDOR = window.API_ROUTES.PROVEEDOR;
  // const URL_ROL = window.API_ROUTES.ROL;

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoria, setCategoria] = useState("");
  const [tablaCategoria, setTablaCategoria] = useState([]);
  const [tablaProveedor, setTablaProveedor] = useState([]);
  const [proveedor, setProveedor] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    crearProducto();
  };

  const handleClose = () => {
    clear();
    props.onClose();
  };
  useEffect(() => {
    cargarCategoria();
    cargarProveedor();
  }, [props.show]);

  const crearProducto = async () => {
    try {
      const producto = {
        nombre: nombre,
        descripcion: descripcion,
        precio_venta: precio,
        stock: stock,
        categoria: categoria,
        // proveedor: proveedor,
      };
      await ConsultasAPI.CrearObjeto(URL_PRODUCTO, producto).then(
        (response) => {
          Swal.fire({
            title: "Crecion exitosa",
            text: "producto generado con exito",
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
      console.error("Error al crear el producto:", error);
      throw error;
    }
  };

  const cargarCategoria = () => {
    try {
      ConsultasAPI.ListarObjetos(URL_CATEGORIA).then((response) => {
        let categorias = response.data.results;
        if (categorias) {
          let datos = [];
          categorias.forEach((categoria) => {
            datos.push({
              id: categoria.id,
              nombre: categoria.nombre,
              descripcion: categoria.descripcion,
            });
          });
          // console.log(datos);
          setTablaCategoria(datos);
        }
      });
    } catch (error) {
      console.log("Problemas al mostrar cartones no registrados", error);
    }
  };

  const cargarProveedor = () => {
    try {
      ConsultasAPI.ListarObjetos(URL_PROVEEDOR).then((response) => {
        let proveedores = response.data.results;
        if (proveedores) {
          let datos = [];
          proveedores.forEach((proveedor) => {
            datos.push({
              id: proveedor.id,
              nombre: proveedor.nombre,
              telefono: proveedor.telefono,
              direccion: proveedor.direccion,
              email: proveedor.email,
            });
          });
          console.log(datos);
          setTablaProveedor(datos);
        }
      });
    } catch (error) {
      console.log("Problemas al mostrar cartones no registrados", error);
    }
  };

  const clear = () => {
    setDescripcion("");
    setNombre("");
    setPrecio("");
    setStock("");
    setCategoria("");
    setProveedor("");
  };

  const handleTablaCategoriaChange = (categoria) => {
    setCategoria(tablaCategoria.filter((x) => x.id === parseInt(categoria))[0]);
  };
  const handleTablaProveedorChange = (proveedor) => {
    setProveedor(tablaProveedor.filter((x) => x.id === parseInt(proveedor))[0]);
  };

  return (
    <Modal show={props.show} size="xl">
      <Modal.Header closeButton onClick={handleClose}>
        <Modal.Title> Agregar Rango</Modal.Title>
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
                    <Form.Label>Precio:</Form.Label>
                    <Col>
                      <Form.Control
                        type="text"
                        value={precio}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const precioVenta = inputValue.replace(/\D/g, "");
                          setPrecio(precioVenta);
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
                    <Form.Label>Categoría:</Form.Label>
                    <Form.Select
                      value={categoria ? categoria.id : ""}
                      onChange={(event) => {
                        handleTablaCategoriaChange(event.target.value);
                      }}
                      required
                    >
                      <option hidden>Elegir Categoria</option>
                      {tablaCategoria.length > 0
                        ? tablaCategoria.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                              {categoria.nombre}
                            </option>
                          ))
                        : null}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group
                    style={{ alignContent: "center", justifyContent: "center" }}
                  >
                    <Form.Label>Proveedor:</Form.Label>
                    <Form.Select
                      value={proveedor ? proveedor.id : ""}
                      onChange={(event) => {
                        handleTablaProveedorChange(event.target.value);
                      }}
                    >
                      <option hidden>Elegir Proveedor</option>
                      {tablaProveedor.length > 0
                        ? tablaProveedor.map((proveedor) => (
                            <option key={proveedor.id} value={proveedor.id}>
                              {proveedor.nombre}
                            </option>
                          ))
                        : null}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group
                    style={{ alignContent: "center", justifyContent: "center" }}
                  >
                    <Form.Label>Stock:</Form.Label>

                    <Form.Control
                      type="text"
                      value={stock}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        const stock = inputValue.replace(/\D/g, ""); // Filtrar caracteres no numéricos y limitar la longitud a dos
                        setStock(stock);
                      }}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3" style={{ justifyContent: "center" }}>
                <Col>
                  <Form.Group>
                    <Form.Label>Descripción:</Form.Label>
                    <Form.Control
                      type="text"
                      value={descripcion}
                      onChange={(e) => setDescripcion(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn botonCPA m-3" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            className="btn botonCPA m-3"
            // onClick={subirRango}
            type="submit"
          >
            Generar Producto
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
export default ModalCargarProducto;
