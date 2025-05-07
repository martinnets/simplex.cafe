import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import cotizacionDataService from "../../../_services/cotizacion";
import clienteDataService from "../../../_services/cliente";
import productoDataService from "../../../_services/producto";

import { useAuth } from "../../modules/auth";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import { Cotizacion } from "../../../_models/cotizacion";
import { Modal, Button, Form, Table, Container, Row, Col, Card, InputGroup } from 'react-bootstrap';
import { DDlPersonal } from "../../../_metronic/layout/components/select/personal";
import Select from 'react-select';
import { Cliente } from "../../../_models/cliente";
import moment from "moment";

export default function CotizacionForm() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const [correlativo, setCorrelativo] = useState("");
    const idcotizacion = queryParameters.get("id")
    const [cotizacion, setcotizacion] = useState<Cotizacion>({moneda:'PEN',fecha: new Date().toISOString().split('T')[0],});
    const [cliente, setCliente] = useState([]);
    const [clientenuevo, setClienteNuevo] = useState<Cliente>({});
    const [selectedOption, setSelectedOption] = useState([]);
    const [productos, setProductos] = useState([]);
    // Estado para la tabla de productos seleccionados en la venta
    const [productosVenta, setProductosVenta] = useState([]);
    // Estados para manejar el modal de productos
    const [showModal, setShowModal] = useState(false);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar el Registro?");
        if (answer) {
            
            if (idcotizacion == null) {
                cotizacion.usu_crea = currentUser?.codigo
                cotizacion.codigo_estado = '1'
                cotizacion.empresaId = currentUser?.empresa[0]._id
                cotizacion.cotizacion=correlativo
                cotizacion.detalle=productosVenta
                cotizacion.clienteId=selectedOption[0].value
                cotizacion.total=calcularTotal()
                console.log(cotizacion);
                console.log(productosVenta);
                cotizacionDataService.createcotizacion(cotizacion)

                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Insertado correctamente");
                        navigate('/cotizacion');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                cotizacion.usu_modi = currentUser?.codigo
                cotizacion._id = idcotizacion
                cotizacionDataService.updatecotizacion(idcotizacion, cotizacion)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Actualizado correctamente");
                        navigate('/cotizacion');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        }
    };
    const handleChange = (e) => {
        console.log();
        setcotizacion((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    // Función para calcular el total de la venta
    const calcularTotal = () => {
        return productosVenta.reduce((total, item) => total + (item.cantidad * item.precio_unitario), 0);
    };
 // Filtrar productos según búsqueda
 useEffect(() => {
    if (busqueda.trim() === '') {
        setProductosFiltrados(productos);
        console.log(busqueda)

      } else {
        const filtrados = productos.filter(producto => 
          producto.producto.toLowerCase().includes(busqueda.toLowerCase()) || 
          producto.codigo.toLowerCase().includes(busqueda.toLowerCase()) 
        );
        
        setProductosFiltrados(filtrados);
        console.log(busqueda)

      }
  }, [busqueda, productos]);

    // Efecto para cargar productos de ejemplo
    useEffect(() => {
          productoDataService.getproducto(currentUser?.empresa[0]._id)
                  .then(response => response.json())
                  .then(response => {
                    setProductos(response)
                    setProductosFiltrados(response);
                    //console.log(response)
                  })
                  .catch(e => {
                    console.log(e);
                  });
                
 clienteDataService.getcliente(currentUser?.empresa[0]._id)
            .then(response => response.json())
            .then(response => {
                setCliente(response)
                console.log(response)
            })                    
            if (idcotizacion!==null) {
                cotizacionDataService.getcotizacionById(idcotizacion)
                                .then(response => response.json())
                                .then(result => {
                                    setcotizacion(result);
                                    setCorrelativo(String(result.cotizacion).padStart(8, '0'))
                                    setProductosVenta(result.detalle)
                                    console.log(result);
                                })
                                .catch(e => {
                                    console.log(e);
                                });
            }else {
                cotizacionDataService.getcorrelativo(currentUser?.empresa[0]._id)
                    .then(response => response.json())
                    .then(result => {
                        let scorrelativo = ''
                        if (result.length===0){
                            scorrelativo='00000001'
                        }else {
                            scorrelativo=String(result[0].correlativo).padStart(8, '0')
                        }
                        setCorrelativo(scorrelativo)
                    })
            }
    }, []);

    // // Manejar cambios en la cabecera de venta
    // const handleVentaChange = (e) => {
    //     const { name, value } = e.target;
    //     setVenta({
    //         ...venta,
    //         [name]: value
    //     });
    // };

    // Abrir modal de productos
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setProductosSeleccionados([]);
    };
// Manejar búsqueda de productos
const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
//console.log(e.target.value)
};
// Manejar selección de productos en el modal
const handleSeleccionProducto = (producto) => {
        const isSelected = productosSeleccionados.some(p => p._id === producto._id);
        if (isSelected) {
            setProductosSeleccionados(productosSeleccionados.filter(p => p._id !== producto._id));
        } else {
            setProductosSeleccionados([...productosSeleccionados, { ...producto, cantidad: 1 }]);
        }
    };

    // Agregar productos seleccionados a la venta
    const agregarProductosAVenta = () => {
        // Verificar si algún producto ya está en la venta
        const nuevosProductos = productosSeleccionados.map(producto => {
            // Verificar si el producto ya está en la venta
            const existente = productosVenta.find(p => p._id === producto._id);
            if (existente) {
                // Incrementar cantidad si ya existe
                return { ...existente, cantidad: existente.cantidad + 1 };
            }
            // Agregar nuevo producto
            return { ...producto, cantidad: 1 };
        });

        // Filtrar productos que ya están y los que son nuevos
        const productosExistentes = nuevosProductos.filter(p =>
            productosVenta.some(pv => pv._id === p._id)
        );

        const productosNuevos = nuevosProductos.filter(p =>
            !productosVenta.some(pv => pv._id === p._id)
        );

        // Actualizar productos en venta
        const ventaActualizada = productosVenta.map(p => {
            const actualizado = productosExistentes.find(pe => pe._id === p._id);
            return actualizado || p;
        });

        setProductosVenta([...ventaActualizada, ...productosNuevos]);
        handleCloseModal();
    };

    // Manejar cambio de cantidad en productos de la venta
    const handleCantidadChange = (id, cantidad) => {
        if (cantidad > 0) {
            const productosActualizados = productosVenta.map(producto =>
                producto._id === id ? { ...producto, cantidad: parseInt(cantidad) } : producto
            );
            setProductosVenta(productosActualizados);
        }
    };

    // Eliminar producto de la venta
    const eliminarProducto = (id) => {
        setProductosVenta(productosVenta.filter(producto => producto._id !== id));
    };

    //Formatear número como moneda
    const formatoMoneda = (valor) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: cotizacion.moneda
        }).format(valor);
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-light-primary">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-dark">Registro de cotizacion</h3>
                        <span className="text-dark">Detalle
                        </span>
                    </div>
                    <div className="d-flex   flex-row-fluid justify-content-end">

                        <Link to={"/cotizacion"}
                            className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                            <i className="fa-solid fa-reply "></i>
                            Volver
                        </Link>
                        <button className='btn btn-primary btn-sm' type="submit">
                            <i className="fa-solid fa-floppy-disk"></i>
                            Guardar</button>
                    </div>
                </div>
                <div className="card card-custom">
                    <div className="card-body pt-10">
                        <div className="form-group row">
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Correlativo</label>
                                    <input type="text" name="pedido" readOnly defaultValue={correlativo}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Fecha</label>
                                    <input type="date" name="fecha" defaultValue={cotizacion.fecha}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Moneda</label>
                                   <select className="form-control" required onChange={handleChange}
                                    name="moneda" value={cotizacion.moneda}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="moneda" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Estado</label>
                                   <select className="form-control" required onChange={handleChange}
                                    name="codigo_estado" value={cotizacion.codigo_estado}>
                                        <option value="">[Seleccione]</option>
                                        <option value="1">Activo</option>
                                        <option value="0">Anulado</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="col-lg-12  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Descripcion</label>
                                    <input type="text" name="descripcion" defaultValue={cotizacion.descripcion}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                           
                            <div className="col-lg-6  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Cliente</label>
                                    <Select
                                        id="sct"
                                        name="sct"
                                        isClearable
                                        options={cliente.map((option, _id) => ({                                            value: option._id,                                            label: option.cliente
                                        }))}
                                        value={selectedOption}
                                        onChange={ (v) => {
                                        if (v === null) { // Click on the clear cross
                                            setSelectedOption(null);
                                        } else if (v.value) {
                                            const options = [];
                                            options.push({ label: v.label, value: v.value })
                                            setSelectedOption(options);                                        }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Referencia</label>
                                    <input type="text" name="referencia" defaultValue={cotizacion.referencia}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Vendedor</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="vendedorId" value={cotizacion.vendedorId}>
                                        <option value="">[Seleccione]</option>
                                         <DDlPersonal puesto="vendedor" empresaId={currentUser.empresa[0]._id} />
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-light-primary">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-dark">Detalle de la Cotización</h3>
                        <span className="text-dark">Agregue productos o servicios
                        </span>
                    </div>
                    <div className="d-flex   flex-row-fluid justify-content-end">
                        <Button className="btn btn-danger btn-sm "
                            onClick={handleShowModal}>
                            <i className="fa-solid fa-plus"></i>
                            Agregar Producto
                        </Button>
                    </div>
                </div>
                <Card className="mb-4">
                    <Card.Body>
                        <Table striped bordered hover responsive className="responsive ">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Producto</th>
                                    <th >Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Subtotal</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosVenta.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center">No hay productos agregados</td>
                                    </tr>
                                ) : (
                                    productosVenta.map((producto, index) => (
                                        <tr key={producto._id}>
                                            <td>{index + 1}</td>
                                            <td>{producto.producto}</td>
                                            <td className="text-end">
                                                <Form.Control
                                                    type="number"
                                                    min="1"
                                                    value={producto.cantidad}
                                                    onChange={(e) => handleCantidadChange(producto._id, e.target.value)}
                                                />
                                            </td>
                                            <td className="text-end">{formatoMoneda(producto.precio_unitario)}</td>
                                            <td className="text-end">{formatoMoneda(producto.precio_unitario * producto.cantidad)}</td>
                                            <td>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => eliminarProducto(producto._id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={4} className="text-end"><strong>Total:</strong></td>
                                    <td colSpan={2}><strong>{formatoMoneda(calcularTotal())}</strong></td>
                                </tr>
                            </tfoot>
                        </Table>
                    </Card.Body>
                </Card>
                <div className="col-lg-12  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Condiciones Comerciales</label>
                                    <textarea rows={2} name="condiciones" defaultValue={cotizacion.condiciones}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-12  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Observaciones</label>
                                    <textarea rows={2} name="observaciones" defaultValue={cotizacion.observaciones}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>

                {/* Modal para seleccionar productos */}
                <Modal show={showModal} onHide={handleCloseModal} 
                 size="lg"
                 aria-labelledby="contained-modal-title-vcenter"
                 style={{ height:'500px',position:"absolute"}}
                 centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Seleccionar Productos</Modal.Title>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary"
                            onClick={agregarProductosAVenta}
                            disabled={productosSeleccionados.length === 0}>
                            Agregar {productosSeleccionados.length} producto(s)
                        </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="mb-3">
                            <InputGroup>
                            <InputGroup.Text>
                                <i className="bi bi-search"></i>🔍
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Buscar productos por nombre o ID..."
                                value={busqueda}
                                onChange={handleBusquedaChange} autoFocus
                            />
                            </InputGroup>
                        </Form.Group>
                        <Table style={{ height:'500px'}}  >
                            <thead>
                                <tr>
                                    <th>Seleccionar</th>
                                    <th>ID</th>
                                    <th>Producto</th>
                                    <th>Marca</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productosFiltrados.map(producto => (
                                    <tr key={producto._id}>
                                        <td>
                                             <Form.Check
                                                type="checkbox"
                                                checked={productosSeleccionados.some(p => p._id === producto._id)}
                                                onChange={() => handleSeleccionProducto(producto)}
                                            />
                                        </td>
                                        <td><span>{producto.codigo}</span></td>
                                        <td>{producto.producto}</td>
                                        <td>{producto.marca}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                       
                    </Modal.Footer>
                </Modal>
            </form>
            
            {/* Añadir estilos personalizados */}
     
        </>
    );
}
