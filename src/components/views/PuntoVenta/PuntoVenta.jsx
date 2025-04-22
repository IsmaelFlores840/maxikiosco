import { Container, Col, Row, Card, Button, Form } from "react-bootstrap";
import { MRT_Localization_ES } from "material-react-table/locales/es";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import ModalEditar from "./ModalEditar";
import ConsultasAPI from "../../../helpers/consultasAPI";
import "react-datetime/css/react-datetime.css";
import BtnVolver from "../../common/BtnVolver";
import { Edit, Delete } from "@mui/icons-material";
import Swal from "sweetalert2";
import { Typeahead } from "react-bootstrap-typeahead";
import Notificaciones from "../../../helpers/notificacionesToast";
import { darken, IconButton } from "@mui/material";

const PuntoVenta = (props) => {
  const rolUser = props.rolUsuario;
  const URL_PRODUCTO = window.API_ROUTES.PRODUCTO;
  const URL_VENTA = window.API_ROUTES.VENTA;

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [count, setCount] = useState();
  const [columnFilters, setColumnFilters] = useState([]);
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  const [tablaProductos, setTablaProductos] = useState([]);

  const [modalEditar, setModalEditar] = useState(false);
  const [tituloModal, setTituloModal] = useState("");
  const [codigoBarras, setCodigoBarras] = useState("");
  const [totalCompra, setTotalCompra] = useState(0);
  const [datos, setDatos] = useState([]);

  useEffect(() => {
    cargarProductos();
  }, [props.show]);

  useEffect(() => {
    calcularTotalCompra();
  }, [data]);

  // useEffect(() => {
  //   const handleKeyPress = (e) => {
  //     if (e.key === "F2") {
  //       // Detecta específicamente la tecla F2
  //       handleOpenModalConsulta();
  //       // Aquí puedes agregar más lógica si necesitas
  //     }
  //   };

  //   // Agregar el event listener al montar el componente
  //   window.addEventListener("keydown", handleKeyPress);

  //   // Limpiar el event listener al desmontar el componente
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyPress);
  //   };
  // }, []); // El array vacío [] asegura que solo se ejecute una vez

  const cobrar = async () => {
    if (!data || data.length === 0) {
      Notificaciones.notificacion("No hay productos para cobrar.");
      return;
    }

    try {
      const productosFormateados = data.map((producto) => ({
        ...producto,
        precio_venta: parseFloat(
          producto.precio_venta.replace("$", "").replace(/\s/g, "")
        ),
        importe: parseFloat(producto.importe),
        precio_unitario: parseFloat(producto.precio_unitario),
      }));

      const venta = {
        total: parseFloat(totalCompra.replace(/\./g, "").replace(",", ".")),
        productos: productosFormateados,
      };
      console.log(venta);
      const response = await ConsultasAPI.CrearObjeto(URL_VENTA, venta);

      if (response.status === 201) {
        Notificaciones.notificacion("Venta creada exitosamente.");
        setData([]);
      } else {
        Notificaciones.notificacion("Error al crear la venta.");
      }
    } catch (error) {
      console.error("Error al crear la venta:", error);
      Notificaciones.notificacion(
        "Error al procesar la venta: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  const calcularTotalCompra = () => {
    let total = 0;
    data.forEach((producto) => {
      const precioUnitario = parseFloat(
        producto.precio_venta.replace(/[^0-9.-]+/g, "")
      );
      const cantidad = producto.cantidad || 1;
      total += (isNaN(precioUnitario) ? 0 : precioUnitario) * cantidad;
    });
    format(total);
  };
  //Columnas de la tabla
  const columns = useMemo(() => [
    {
      header: "Nombre",
      accessorKey: "nombre",
      size: 15,
    },
    {
      header: "Precio Unitario",
      accessorKey: "precio_venta",
      size: 20,
    },
    {
      header: "Descripción",
      accessorKey: "descripcion",
      size: 20,
    },
    {
      header: "Cantidad",
      accessorKey: "cantidad",
      size: 20,
    },
    {
      header: "Importe",
      size: 20,
      Cell: ({ row }) =>
        `$ ${(row.original.precio_unitario * row.original.cantidad).toFixed(
          2
        )}`,
    },
  ]);

  const cargarProductos = async () => {
    try {
      await ConsultasAPI.ListarObjetos(
        URL_PRODUCTO,
        pagination.pageIndex,
        pagination.pageSize,
        columnFilters,
        null,
        null,
        null,
        null,
        null,
        null
      ).then((response) => {
        let productos = response.data.results;
        setCount(response.data.count);
        if (productos) {
          let datos = [];
          productos.forEach((producto) => {
            datos.push({
              id: producto.id,
              nombre: producto.nombre,
              descripcion: producto.direccion,
              precio_venta: producto.precio_venta,
              label: producto.nombre + " - $ " + producto.precio_venta, // Nuevo campo formateado
              codigo_barras: producto.codigo_barras,
            });
          });
          setTablaProductos(datos);
        }
      });
    } catch (error) {
      console.log("Problemas al mostrar productos", error);
    }
  };

  const buscarProducto = async (codigo_barras) => {
    try {
      const response = await ConsultasAPI.ObtenerObjeto(
        URL_PRODUCTO + "buscarProducto/",
        codigo_barras
      );

      if (response.status === 200) {
        const producto = response.data;
        const productoExistente = data.find((item) => item.id === producto.id);

        if (productoExistente) {
          // Verificar si al incrementar la cantidad supera el stock
          if (productoExistente.cantidad + 1 > producto.stock) {
            Swal.fire({
              title: "Cantidad excedida",
              text: "No hay suficiente stock disponible",
              icon: "error",
              confirmButtonText: "Aceptar",
            });
            setCodigoBarras("");
            return; // Detener la ejecución si no hay stock suficiente
          }

          const nuevosProductos = data.map((item) =>
            item.id === producto.id
              ? {
                  ...item,
                  cantidad: item.cantidad + 1,
                  importe: (
                    parseFloat(producto.precio_venta) *
                    (item.cantidad + 1)
                  ).toFixed(2),
                }
              : item
          );
          setData(nuevosProductos);
        } else {
          // Verificar si hay stock para agregar el producto (cantidad inicial = 1)
          if (producto.stock < 1) {
            Swal.fire({
              title: "Cantidad excedida",
              text: "No hay suficiente stock disponible",
              icon: "error",
              confirmButtonText: "Aceptar",
            });
            setCodigoBarras("");
            return;
          }

          const precioUnitario = parseFloat(producto.precio_venta);
          const productoFormateado = {
            ...producto,
            precio_unitario: precioUnitario,
            precio_venta: `$ ${precioUnitario.toFixed(2)}`,
            cantidad: 1,
            importe: precioUnitario.toFixed(2),
            categoria: producto.categoria_detalle?.nombre || "Sin categoría",
          };
          setData((prevData) => [...prevData, productoFormateado]);
        }
        setCodigoBarras("");
      }
    } catch (error) {
      console.error("Error en la búsqueda:", error);
      Notificaciones.notificacion("Error al buscar producto", "error");
    }
  };

  const handleSelectProducto = (selected) => {
    setSelectedOption(selected || []);
    buscarProducto(selected[0].codigo_barras);
  };

  const sacarDeTabla = (producto) => () => {
    setData((prev) =>
      prev.filter((item) => item.codigo_barras !== producto.codigo_barras)
    );
  };

  const handleCloseModalConsulta = () => {
    setTituloModal("");
    setDatos([]);
    setModalEditar(false);
  };

  const handleOpenModalConsulta = (row) => {
    setTituloModal("Editar");
    setDatos(row);
    setModalEditar(true);
  };

  const handleUpdateProduct = (updatedProduct) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === updatedProduct.id ? updatedProduct : item
      )
    );
  };

  function format(input) {
    var num = input.toString().replace(/\./g, "");
    num = num
      .split("")
      .reverse()
      .join("")
      .replace(/(?=\d*\.?)(\d{3})/g, "$1.");
    num = num.split("").reverse().join("").replace(/^[\.]/, "");
    input = num;
    setTotalCompra(input);
    return num;
  }
  const clean = () => {
    setSelectedOption([]);
    setCodigoBarras("");
    // setData([]);
  };

  return (
    <Container className="mt-4 mb-4 mainSection">
      <Card>
        <Card.Header
          style={{
            justifyContent: "space-between",
          }}
        >
          <Row className="align-items-center">
            <Col>
              <h2>PuntoVenta</h2>
            </Col>
            <Col style={{ paddingLeft: "50px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h3 style={{ whiteSpace: "nowrap", marginRight: "8px" }}>
                  Total: $
                </h3>
                <div
                  style={{
                    flex: 1 /* Ocupa todo el espacio restante */,
                    border: "2px solid rgb(213, 217, 223)",
                    borderRadius: "5px",
                    padding: "3px 8px",
                    backgroundColor: "#ffffff",
                    fontWeight: "bold",
                    textAlign: "right" /* Alinea el texto a la derecha */,
                    fontSize: "25px", //tamaño de la letra
                  }}
                >
                  {totalCompra}
                </div>
              </div>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="mb-13" style={{ paddingBottom: 0 }}>
          <Row
            style={{
              padding: 10,
            }}
          >
            <Col>
              <Form.Group
                style={{
                  alignItems: "center",
                }}
              >
                <Form.Label>Producto:</Form.Label>
                <Typeahead
                  id="autocomplete"
                  options={tablaProductos}
                  labelKey="label"
                  onChange={handleSelectProducto}
                  selected={selectedOption} // Asegúrate que siempre sea array
                  placeholder="Escribe aquí para autocompletar"
                  required
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group
                style={{
                  alignItems: "center",
                }}
              >
                <Form.Label>Codigo de Barras:</Form.Label>
                <Form.Control
                  type="text"
                  value={codigoBarras}
                  onChange={(e) => {
                    setCodigoBarras(e.target.value);
                    if (e.target.value !== "") {
                      buscarProducto(e.target.value);
                    }
                  }}
                  required
                />
              </Form.Group>
            </Col>
            <Col
              md={3}
              style={{
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Button
                className="btn"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
                onClick={clean}
              >
                Limpiar
              </Button>
              <Button
                className="btn"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
                onClick={cobrar}
              >
                Cobrar
              </Button>
            </Col>
          </Row>
          <Card className="mb-13">
            <MaterialReactTable
              className="w-100"
              columns={columns}
              data={data}
              muiTableBodyProps={{
                sx: (theme) => ({
                  "& tr:nth-of-type(odd)": {
                    backgroundColor: darken(
                      theme.palette.background.default,
                      0.1
                    ),
                  },
                  fontFamily: "Roboto, sans-serif", // Configuración de la tipografía para las filas pares
                }),
              }}
              initialState={{
                columnVisibility: { id: false }, //hide firstName column by default
                showColumnFilters: true,
              }}
              editingMode="modal" //default
              enableEditing
              enableRowSelection={false} //enable some features
              enableColumnOrdering={false}
              enableHiding={false}
              enableColumnActions={false}
              enableSorting={false}
              // displayColumnDefOptions={{ "mrt-row-actions": { size: 10 } }} //change width of actions column to 300px
              // enableGlobalFilter={false} //turn off a feature
              enableFilters={false}
              localization={MRT_Localization_ES}
              enableRowActions
              positionActionsColumn="last"
              renderRowActions={({ row }) => {
                return (
                  <div className="d-flex">
                    {rolUser === "ADMINISTRADOR" ? (
                      <IconButton
                        onClick={() => handleOpenModalConsulta(row.original)}
                        title="Editar"
                        variant="outline-info"
                      >
                        <Edit />
                      </IconButton>
                    ) : null}
                    {rolUser === "ADMINISTRADOR" ? (
                      <IconButton
                        onClick={() => sacarDeTabla(row.original)}
                        title="Eliminar"
                        variant="outline-info"
                      >
                        <Delete />
                      </IconButton>
                    ) : null}
                  </div>
                );
              }}
              // manualPagination
              // manualFiltering
              muiTablePaginationProps={{
                rowsPerPageOptions: [10],
              }}
              enablePagination={false} //para mostrar la paginación al final de la tabla
              rowCount={count}
              // onPaginationChange={setPagination} //hoist pagination state to your state when it changes internally
              onColumnFiltersChange={(value) => {
                setColumnFilters(value);
              }}
              state={{
                columnFilters,
                pagination,
              }}
            />
          </Card>
          <Row className="text-center">
            <section className="d-flex justify-content-end my-3">
              <BtnVolver
                className="btn boton  fw-bold"
                to="/Principal"
                style={{ float: "right" }}
              >
                Volver
              </BtnVolver>
            </section>
          </Row>
        </Card.Body>
      </Card>

      <ModalEditar
        onClose={handleCloseModalConsulta}
        show={modalEditar}
        tituloModal={tituloModal}
        datosProducto={datos}
        onSave={handleUpdateProduct}
      />
    </Container>
  );
};

export default PuntoVenta;
