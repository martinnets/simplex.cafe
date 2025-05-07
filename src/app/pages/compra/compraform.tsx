
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import compraDataService from "../../../_services/compra";
import compradetDataService from "../../../_services/compradet";
import proveedorDataService from "../../../_services/proveedor";
import ordenDataService from "../../../_services/orden";
import productoDataService from "../../../_services/producto";
import personalDataService from "../../../_services/personal";
import ordendetDataService from "../../../_services/ordendet";
import kardexDataService from "../../../_services/kardex";

import { useAuth } from "../../modules/auth";
import { Compra } from "../../../_models/compra";
import { Orden } from "../../../_models/orden";
import { Proveedor } from "../../../_models/proveedor";
import DataTable from "react-data-table-component";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from 'react-select';
import moment from "moment";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import { DDlPersonal } from "../../../_metronic/layout/components/select/personal";
import { DDLAlmacen } from "../../../_metronic/layout/components/select/almacen";



export default function CompraForm() {
    const { currentUser } = useAuth()
    const inputRef = useRef(null);
    const inputRef2 = useRef(null);
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const idorden = queryParameters.get("id")
    const [compra, setCompra] = useState<Compra>({});
    const [orden, setOrden] = useState<Orden>({});
    const [proveedor, setProveedor] = useState([]);
    const [proveedornuevo, setProveedorNuevo] = useState<Proveedor>({});
    const [personal, setPersonal] = useState([]);
 
    const [subtotal, setSubTotal] = useState(0);
    const [igv, setIGV] = useState(0);
    const [total, setTotal] = useState(0);
    
    const [open, setOpen] = useState(false);
    const [productosel, setProductoSel] = useState([]); //Listado de Productos
    const [selectedRows, setSelectedRows] = useState([]); //Productos Seleccionados de la Lista
    const [compradet, setCompraDet] = useState([]); //Productos de la Compra
    const [toggleCleared, setToggleCleared] = useState(false);
    const handleRowSelected = React.useCallback(state => {
        setSelectedRows(state.selectedRows);
    }, []);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const columnsproductosel = [
        {
            name: 'codigo',
            selector: (row: any) => row.codigo, sortable: true
        },
        {
            name: 'producto',
            selector: (row: any) => row.producto, sortable: true
        },
        {
            name: 'categoria',
            selector: (row: any) => row.categoria, sortable: true
        },
    ]
    const columnsproducto = [
        {
            name: 'id',
            cell: (row: any) => (
                <div>
                    <span>{row.index}</span>
                </div>
            ), selector: (row: any) => row._id, sortable: true
        },
        {
            name: 'producto',
            selector: (row: any) => row.producto, sortable: true
        },
        {
            name: 'cnt',
            cell: (row: any) => (
                <div>
                    <input type="number" id={'cantidad-' + row._id} className="form-control text-end"
                        onChange={(event) => handleSubTotalCantidad(event, row._id)} placeholder="0.00"
                        defaultValue={row.cantidad} data-kt-element="unit" ></input>
                </div>
            ), selector: (row: any) => row.cantidad, sortable: true
        },
        {
            name: 'precio',
            cell: (row: any) => (
                <div>
                    <input type="number" id={'precio_unitario-' + row._id} className="form-control text-end"
                        onChange={(event) => handleSubTotalPrecio(event, row._id)} placeholder="0.00"
                        defaultValue={row.precio_unitario} data-kt-element="price" ></input>
                </div>
            ), selector: (row: any) => row.cantidad, sortable: true
        },
        {
            name: 'id',
            cell: (row: any) => (
                <div>
                    <input type="number" readOnly id={'subtotal-' + row._id} className="form-control text-end"
                        value={row.content} ></input>
                </div>
            ), selector: (row: any) => row.content, sortable: true
        },
        {
            name: 'id',
            cell: (row: any) => (
                <div>
                    <a className='btn btn-icon btn-light-danger btn-sm' >
                        <i className="bi bi-trash"></i>
                    </a>
                </div>
            ), selector: (row: any) => row._id, sortable: true
        },
    ]
    const handleDelete = (iditem) => {
        const idindex = compradet.findIndex(element => element._id === iditem);
        const product = compradet[idindex]
        if (window.confirm(`Seguro quiere eliminar el elemento:\r ${product.producto}?`)) {
            product.cantidad = 0
            product.precio_unitario = 0
            product.subtotal = 0
            const newOrdenArray = compradet.filter((item) => item._id !== iditem)
            setCompraDet(newOrdenArray)
            setTotal(0)
            calculatotal();
        }
    };
    const handleSubTotalCantidad = (event, iditem) => {
        console.log(compradet)
        const idindex = compradet.findIndex(element => element._id === iditem);
        compradet[idindex].cantidad = parseFloat(event.target.value)
        compradet[idindex].subtotal = parseFloat(event.target.value) * compradet[idindex].precio_unitario
        setCompraDet(compradet)
        calculatotal();
    }
    const handleSubTotalPrecio = (event, iditem) => {
        //console.log(compradet)
        const idindex = compradet.findIndex(element => element._id === iditem);
        console.log(event)
        console.log(iditem)
        console.log(idindex)
        compradet[idindex].precio_unitario = parseFloat(event.target.value)
        compradet[idindex].subtotal = parseFloat(event.target.value) * compradet[idindex].cantidad
        setCompraDet(compradet)
        calculatotal();
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar la Compra?");
        if (answer) {
            if (compradet.length > 0) {
                compra.usu_crea = currentUser?.codigo
                compra.codigo_estado = '1'
                //compra.orden = correlativo
                compra.subtotal = subtotal
                compra.igv = igv
                compra.total = total
                compra.pagado = 0
                compra.porpagar = total
                compra.empresaId= currentUser?.empresa[0]._id
                console.log(compra)
                compraDataService.createcompra(compra)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        const fecha = new Date().toJSON();
                        compradet.map((item) => {
                            //console.log(item)
                            item.compraId=response.data._id
                            compradetDataService.createcompradet(item)
                                .then(function (response) {
                                    console.log(JSON.stringify(response.data));
                                })
                            // kardexDataService.createkardex([{
                            //     "productoId":item._id,
                            //     "producto":item.producto,
                            //     "fecha": fecha,
                            //     "cantidad":item.cantidad,
                            //     "tipo_mov":1
                            // }])
                        })
                        // pedidoDataService.updatepedido(pedido._id,{
                        //     "codigo_estado":2
                        // })
                        alert("Registro Insertado correctamente");
                        navigate('/compra');
                    })
            } else {
                alert("Debe agregar al menos un detalle a la Compra")
            }

        }
    };
    const handleChange = (e) => {
        console.log(e.target)
        setCompra((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        
    };
    const handleChangeProveedor = (e) => {
        //console.log(e.target.value)
        //console.log(e.target.label)
        setCompra((prev) => ({
            ...prev,
            ["proveedorId"]: e._id,
            ["proveedor"]: e.proveedor,
        }));
        console.log(compra);
    };
    const handleChangeProveedorNuevo = (e) => {
        //console.log();
        setProveedorNuevo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const handleChangedProducto = (e) => {
        console.log(e.target.value)
        if (e.target.value.length > 3) {
            const datasearch ={
                "empresaId": currentUser?.empresa[0]._id,
                "producto": e.target.value
            }
            productoDataService.getproductosearch(datasearch)
                .then(function (response) {
                    //console.log(response)
                    setProductoSel(response.data)
                })
                .catch(e => {
                    console.log(e);
                });
        }
    };
    function seleccionarproductos() {
        selectedRows.map((item) => {
            let index = compradet.findIndex(itemd => itemd._id === item._id);
            //console.log(index)
            if (index < 0) {
                compradet.push({
                    "_id": item._id,
                    "codigo": item.codigo,
                    "productoId": item._id,
                    "producto": item.producto,
                    "cantidad": 1,
                    "subtotal":0,
                    "precio_unitario": 0
                })
            }
        })
        calculatotal();
        handleClose();
    }
    function calculatotal() {
        compradet.map((item) => {
            item.subtotal = parseFloat(item.cantidad) * parseFloat(item.precio_unitario)
        })
        const total = compradet.reduce((subt, prod) => subt + Number(prod.subtotal), 0)
        const igv = parseFloat(total) / 1.18 * 0.18
        const subtotal = total - igv
        console.log(total)
        setSubTotal(subtotal)
        setIGV(igv)
        setTotal(total)
    }
    function crearproveedor() {
        console.log(proveedornuevo)
        console.log(proveedornuevo.nro_doc)
        console.log(proveedornuevo.proveedor)
        if (proveedornuevo.proveedor === '' || proveedornuevo.proveedor === undefined) {
            console.log('no grabar')
        } else if (proveedornuevo.nro_doc === '' || proveedornuevo.nro_doc === undefined) {
            console.log('no grabar')
        } else {
            proveedorDataService.createproveedor(proveedornuevo)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                    proveedorDataService.getproveedor()
                        .then(response => response.json())
                        .then(response => {
                            setProveedor(response)
                            inputRef.current.value = "";
                            inputRef2.current.value = "";
                            setProveedorNuevo({})
                        })

                })


        }

    }
    useEffect(() => {
        const fecha = new Date();
        compra.tipo_doc='01'
        compra.fecha=moment().format('yyyy-M-DD')
        compra.vencimiento=moment().format('yyyy-M-DD')
        compra.moneda='PEN'
        proveedorDataService.getproveedor(currentUser.empresa[0]._id)
        .then(response => response.json())
        .then(response => {
          setProveedor	(response)
        })
        .catch(e => {
          console.log(e);
        });
    }, []);
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-light-dark">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-dark">Registro de Compra</h3>
                        <span className="text-dark"></span>
                    </div>
                    <div className="d-flex   flex-row-fluid justify-content-end">
                       
                        <button type="button" className="btn   btn-secondary btn-sm"
                            data-bs-toggle="modal" data-bs-target="#kt_modal_1">
                            <i className="fa-solid fa-user-plus fs-1x"></i>
                            Proveedor
                        </button>
                        <Link to={"/compra"}
                            className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                            <i className="fa-solid fa-reply "></i>
                            Volver
                        </Link>
                        <button className='btn btn-primary btn-sm' type="submit">
                            <i className="fa-solid fa-floppy-disk"></i>
                            Guardar</button>
                    </div>
                </div>

                <div className="">
                    <div className="d-flex bd-highlight">
                        <div className="p-2 flex-grow-1 bd-highlight">
                            <div className="card card-custom">
                                <div className="card-body ">
                                    <div className="form-group row">
                                        <div className="col-lg-2   ">
                                            <div className="  mb-2">
                                                <label className="form-label" >Tipo Documento</label>
                                                <select className="form-control" required onChange={handleChange}
                                                    name="tipo_doc" value={compra.tipo_doc}>
                                                    <option value="">[Seleccione]</option>
                                                  <DDlParametro dominio="tipo_comprobante"/>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-2 input-group-sm mb-2  ">

                                            <input type="text" className="form-control" placeholder="serie" name="serie" required onChange={handleChange} />

                                            <input type="text" className="form-control" placeholder="numero" name="numero" required onChange={handleChange} />

                                        </div>
                                        <div className="col-lg-2  input-group-sm mb-5">
                                            <div className="  mb-2">
                                                <label className="form-label" id="inputGroup-sizing-sm">Fecha Emisión</label>
                                                <input type="date" name="fecha" required defaultValue={compra.fecha}
                                                    className="form-control" onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-lg-2  input-group-sm mb-5">
                                            <div className="  mb-2">
                                                <label className="form-label" id="inputGroup-sizing-sm">Fecha Vencimiento</label>
                                                <input type="date" name="vencimiento" required defaultValue={compra.vencimiento}
                                                    className="form-control" onChange={handleChange} />
                                            </div>
                                        </div>

                                        <div className="col-lg-2  input-group-sm mb-5">
                                            <div className="  mb-2">
                                                <label className="form-label" id="inputGroup-sizing-sm">Condición Pago</label>
                                                <select className="form-control" required onChange={handleChange}
                                                    name="condicion_pago">
                                                    <option value="">[Seleccione]</option>
                                                    <option value="contado">Contado</option>
                                                    <option value="7">a 7 dias</option>
                                                    <option value="15">a 15 dias</option>
                                                    <option value="30">a 30 dias</option>
                                                    <option value="60">a 60 dias</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-2  input-group-sm mb-5">
                                            <div className="  mb-2">
                                                <label className="form-label" id="inputGroup-sizing-sm">Moneda</label>
                                                <select className="form-control" required onChange={handleChange}
                                                    name="moneda" value={compra.moneda}>
                                                    <option value="">[Seleccione]</option>
                                                    <DDlParametro dominio="moneda" />
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-2  input-group-sm mb-5">
                                            <div className="  mb-2">
                                                <label className="form-label" id="inputGroup-sizing-sm">Orden  </label>
                                                <input type="text" name="orden" required defaultValue={compra.orden}
                                                    className="form-control" onChange={handleChange} />
                                            </div>
                                        </div>

                                        <div className="col-lg-2  input-group-sm mb-5">
                                            <div className="  mb-2">
                                                <label className="form-label" id="inputGroup-sizing-sm">Comprador</label>
                                                <select className="form-control" required onChange={handleChange}
                                                    name="compradorId">
                                                    <option value="">[Seleccione]</option>
                                                   <DDlPersonal puesto="comprador" empresaId={currentUser.empresa[0]._id} />
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-2  input-group-sm mb-5">
                                            <div className="  mb-2">
                                                <label className="form-label" id="inputGroup-sizing-sm">Almacen</label>
                                                 
                                                 <select className="form-control" required onChange={handleChange}
                                                    name="almacenId">
                                                    <option value="">[Seleccione]</option>
                                                    <DDLAlmacen empresaId={currentUser.empresa[0]._id} />
                                                </select>
                                            </div>
                                        </div>

                                        <div className="col-lg-6  input-group-sm mb-5">
                                            <div className="  mb-2">
                                                <label className="form-label" id="inputGroup-sizing-sm">Proveedor</label>
                                                <Select required placeholder="Seleccione Proveedor"
                                                    name="_id"
                                                    options={proveedor}
                                                    onChange={(e) => handleChangeProveedor(e)}
                                                    getOptionValue={option => option._id}
                                                    getOptionLabel={option => option.proveedor}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-light-primary">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-dark">Detalle de la Compra</h3>
                        <span className="text-dark">Agregue productos
                        </span>
                    </div>
                    <div className="d-flex   flex-row-fluid justify-content-end">
                        <Button className="btn btn-danger btn-sm "
                            onClick={handleClickOpen}>
                            <><i className="fa-solid fa-plus"></i></>
                            Agregar Producto
                        </Button>
                    </div>
                </div>
                <table className="table table-responsive">
                    <thead>
                        <tr className="bg-info text-dark text-bold bordered">
                            <td></td>
                            <td className="text-light" >Código</td>
                            <td className="text-light" >Producto</td>
                            <td className="text-light">Cantidad </td>
                            <td className="text-light">Precio</td>
                            <td className="text-light">Sub Total</td>
                            <td className="text-light">Acción</td>
                        </tr>
                    </thead>
                    <tbody>
                        {compradet.map((item, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.codigo}</td>
                                    <td>{item.producto}</td>
                                    <td>
                                        <input type="number" id={'cantidad-' + item._id} className="form-control text-end"
                                            name="cantidad"
                                            onChange={(event) => handleSubTotalCantidad(event, item._id)} placeholder="0.00"
                                            defaultValue={item.cantidad} ></input>
                                    </td>
                                    <td>
                                        <input type="number" id={'precio_unitario-' + item._id} className="form-control text-end"
                                            name="precio_unitario"
                                            onChange={(event) => handleSubTotalPrecio(event, item._id)} 
                                            placeholder="0.00"
                                            defaultValue={item.precio_unitario} ></input>
                                    </td>
                                    <td>
                                        <span className="form-control text-end">{item.subtotal}</span>
                                       
                                    </td>
                                    <td>
                                        <Button onClick={(e) => handleDelete(item._id)} className="btn btn-icon btn-sm" >
                                            <i className="bi bi-trash text-danger"></i>
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div className="separator my-10"></div>
                <div className="row">
                    <div className="col">
                        <div className="col-lg-12  input-group-sm mb-5">
                            <div className="  mb-2">
                                <label className="form-label" id="inputGroup-sizing-sm">Observaciones</label>
                                <textarea rows={4} name="observaciones" defaultValue={compra.observacion}
                                    className="form-control" onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-auto">
                        <div className="row">
                            <h1 className="d-block lh-1 mb-2 text-end">Sub Total : </h1>
                        </div>
                        <div className="row">
                            <h1 className="fw-bold mb-5 text-end">IGV (18%) : </h1>
                        </div>
                        <div className="row">
                            <h1 className="fw-bold mb-5 text-end">Total : </h1>
                        </div>
                    </div>

                    {compradet.length > 0 ?
                        <> <div className="col col-lg-2">
                            <div className="row">
                                <span className="  text-end fs-2qx lh-1 mb-2" >{subtotal.toFixed(2)} </span>
                            </div>
                            <div className="row">
                                <span className=" text-end fs-2qx lh-1 mb-2"   >{igv.toFixed(2)}</span>
                            </div>
                            <div className="row">
                                <span className=" text-end fs-3qx lh-1 mb-2" >{total.toFixed(2)}</span>
                            </div>
                        </div>
                        </> : <></>}

                </div>
                <Dialog open={open} onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description">
                    <DialogTitle id="alert-dialog-title">
                        {"Seleccione Producto"}
                    </DialogTitle>
                    <DialogContent>
                        <input name="codigo_personal" className="form-control"
                            placeholder="Escriba producto a buscar..."
                            onChange={handleChangedProducto} ></input>
                        <DataTable
                            columns={columnsproductosel}
                            data={productosel}
                            noDataComponent="Sin registros"
                            pagination
                            selectableRows
                            onSelectedRowsChange={handleRowSelected}
                            clearSelectedRows={toggleCleared}
                        />
                    </DialogContent>
                    <DialogActions>
                        <button className="btn btn-secondary" onClick={handleClose}>Cerrar</button>
                        <button className="btn btn-danger" onClick={seleccionarproductos}>
                            Seleccionar Productos
                        </button>

                    </DialogActions>
                </Dialog>
            </form>
            <div className="modal fade" id="kt_modal_1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">Nuevo Proveedor</h3>
                            <div className="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                                <i className="ki-duotone ki-cross fs-1"><span className="path1"></span><span className="path2"></span></i>
                            </div>
                        </div>

                        <div className="modal-body">
                            <form>
                                <div className="form-group row">
                                    <div className="col-lg-12  input-group-sm mb-5">
                                        <div className="  mb-2">
                                            <label className="form-label" id="inputGroup-sizing-sm">RUC</label>
                                            <input type="text" placeholder="Numero de RUC" name="nro_doc"
                                                ref={inputRef}
                                                onChange={handleChangeProveedorNuevo} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12  input-group-sm mb-5">
                                        <div className="  mb-2">
                                            <label className="form-label" id="inputGroup-sizing-sm">Proveedor</label>
                                            <input type="text" placeholder="Razon Social" name="proveedor"
                                                ref={inputRef2}
                                                onChange={handleChangeProveedorNuevo} className="form-control" />
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={crearproveedor}>Guardar Proveedor</button>
                        </div>
                    </div>
                </div>
            </div>
          
        </>
    );
}
