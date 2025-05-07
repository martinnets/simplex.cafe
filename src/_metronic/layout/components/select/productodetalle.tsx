import React, { useState, useEffect } from "react";
import productoDataService from "../../../../_services/producto";
import { useAuth } from "../../../../app/modules/auth";

import { Modal, Button, Form, Table, Container, Row, Col, Card, InputGroup } from 'react-bootstrap';

const ProductoDetalle = ({ onProductoChange }) => {
    const { currentUser } = useAuth()
    const [productos, setProductos] = useState([]);
    const [productosVenta, setProductosVenta] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const calcularTotal = () => {
        return productosVenta.reduce((total, item) => total + (item.cantidad * item.precio_unitario), 0);
    };
    useEffect(() => {
        if (busqueda.trim() === '') {
            setProductosFiltrados(productos);
            //console.log(busqueda)
        } else {
            const filtrados = productos.filter(producto =>
                producto.producto.toLowerCase().includes(busqueda.toLowerCase()) ||
                producto.codigo.toLowerCase().includes(busqueda.toLowerCase())
            );
            setProductosFiltrados(filtrados);
            //console.log(busqueda)
        }
    }, [busqueda, productos]);
    useEffect(() => {
        productoDataService.getproducto(currentUser?.empresa[0]._id)
            .then(response => response.json())
            .then(response => {
                setProductos(response)
                setProductosFiltrados(response);
            })
            .catch(e => {
                console.log(e);
            });
    }, []);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setProductosSeleccionados([]);
    };
    const handleBusquedaChange = (e) => {
        setBusqueda(e.target.value);
    };
    const handleSeleccionProducto = (producto) => {
        const isSelected = productosSeleccionados.some(p => p._id === producto._id);
        if (isSelected) {
            setProductosSeleccionados(productosSeleccionados.filter(p => p._id !== producto._id));
        } else {
            setProductosSeleccionados([...productosSeleccionados, { ...producto, cantidad: 1 }]);
        }
    };
    const agregarProductosAVenta = () => {
        const nuevosProductos = productosSeleccionados.map(producto => {
            const existente = productosVenta.find(p => p._id === producto._id);
            if (existente) {
                return { ...existente, cantidad: existente.cantidad + 1 };
            }
            return { ...producto, cantidad: 1 };
        });
        const productosExistentes = nuevosProductos.filter(p =>
            productosVenta.some(pv => pv._id === p._id)
        );
        const productosNuevos = nuevosProductos.filter(p =>
            !productosVenta.some(pv => pv._id === p._id)
        );
        const ventaActualizada = productosVenta.map(p => {
            const actualizado = productosExistentes.find(pe => pe._id === p._id);
            return actualizado || p;
        });
        setProductosVenta([...ventaActualizada, ...productosNuevos]);
        handleCloseModal();
    };
    const handleCantidadChange = (id, cantidad) => {
        if (cantidad > 0) {
            const productosActualizados = productosVenta.map(producto =>
                producto._id === id ? { ...producto, cantidad: parseInt(cantidad) } : producto
            );
            setProductosVenta(productosActualizados);
        }
    };
    const handlePrecioUnitarioChange = (id, preciounitario) => {
        if (preciounitario > 0) {
            const productosActualizados = productosVenta.map(producto =>
                producto._id === id ? { ...producto, precio_unitario: parseFloat(preciounitario) } : producto
            );
            setProductosVenta(productosActualizados);
        }
    };
    const eliminarProducto = (id) => {
        setProductosVenta(productosVenta.filter(producto => producto._id !== id));
    };

    const formatoMoneda = (valor) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'PEN'
        }).format(valor);
    };
    const formatoNumero = (valor) => {
        return new Intl.NumberFormat('es-ES', {
            style:'decimal'
        }).format(valor);
    };
    useEffect(() => {
        onProductoChange(productosVenta);
      }, [productosVenta]);
    
    return (
        <>
            <div className="alert alert-secondary d-flex align-items-center p-5 bg-light-primary">
                <div className="d-flex flex-column">
                    <h3 className="mb-1 text-dark">Detalle</h3>
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
                                        <td className="text-end">
                                        <Form.Control
                                                type="text" className="text-end"
                                                
                                                value={producto.precio_unitario}
                                                onChange={(e) => handlePrecioUnitarioChange(producto._id, e.target.value)}
                                            />
                                            </td>
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
                                
                            </tr>
                            <tr>
                        
                            </tr>
                        </tfoot>
                    </Table>
                    <div>
                        <div className="col-md-auto">
                                <div className="row">
                                    <h1 className="d-block lh-1 mb-2 text-end">Total : {formatoMoneda(calcularTotal())}</h1> 
                                </div>
                                {/* <div className="row">
                                    <h1 className="fw-bold mb-5 text-end">IGV (18%) : {formatoMoneda(calcularTotal()*0.18)} </h1> 
                                </div>
                                <div className="row">
                                    <h1 className="fw-bold mb-5 text-end">Total : {formatoMoneda(calcularTotal()+(calcularTotal()*0.18))}</h1> 
                                </div> */}
                        </div>
                        
                    </div>
                </Card.Body>
            </Card>
            <Modal show={showModal} onHide={handleCloseModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                style={{ height: '500px', position: "absolute" }}
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
                    <Table style={{ height: '500px' }}  >
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
        </>
    );
};

export default ProductoDetalle;
