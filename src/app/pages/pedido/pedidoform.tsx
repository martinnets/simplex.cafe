
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import pedidoDataService from "../../../_services/pedido";
import clienteDataService from "../../../_services/cliente";
import productoDataService from "../../../_services/producto";
import personalDataService from "../../../_services/personal";
import pedidodetDataService from "../../../_services/pedidodet";
import { useAuth } from "../../modules/auth";
import { Pedido } from "../../../_models/pedido";
import DataTable from "react-data-table-component";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Cliente } from "../../../_models/cliente";
import Select from 'react-select';
import { DDlPersonal } from "../../../_metronic/layout/components/select/personal";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import moment from "moment";
import ProductoDetalle from "../../../_metronic/layout/components/select/productodetalle";

export default function PedidoForm() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const idpedido = queryParameters.get("id")
    const [pedido, setpedido] = useState<Pedido>({moneda:'PEN',
        fecha: new Date().toISOString().split('T')[0]});
    const [cliente, setCliente] = useState([]);
    const [clientenuevo, setClienteNuevo] = useState<Cliente>({});
    const [personal, setPersonal] = useState([]);
    const [subtotal, setSubTotal] = useState(0);
    const [igv, setIGV] = useState(0);
    const [total, setTotal] = useState(0);
    const [correlativo, setCorrelativo] = useState("");
    const [open, setOpen] = useState(false);
    const [productosel, setProductoSel] = useState([]); //Listado de Productos
    const [selectedRows, setSelectedRows] = useState([]); //Productos Seleccionados de la Lista
    const [detalle, setDetalle] = useState([]); //Productos de la Nota de Venta
    const handleRowSelected = React.useCallback(state => {
        //console.log(state.selectedRows)
        // state.selectedRows.map(item => {
        //     item.pedido=correlativo
        //     item.cantidad = 1;
        //     item.precio_unitario = 0
        //     item.subtotal = 0
        // })
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
 
   
  
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar el Registro?");
        if (answer) {
            if (detalle.length>0){
                pedido.usu_crea = currentUser?.codigo
                pedido.codigo_estado = '1'
                //pedido.pedido = Number(correlativo)
                pedido.pedido =  Number(correlativo)
                pedido.subtotal= subtotal
                pedido.igv=igv
                pedido.detalle=detalle
                pedido.total = calcularTotal()
                pedido.empresaId= currentUser?.empresa[0]._id
                pedido.total = calcularTotal()
                pedido.detalle=detalle
                
                pedidoDataService.createpedido(pedido)
                        .then(function (response) {

                            alert("Registro Insertado correctamente");
                            navigate('/pedido');
                        })
            }else {
                alert("Debe agregar al menos un detalle al pedido")
            }
            
        }
    };
    const handleChange = (e) => {
        console.log();
        setpedido((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const handleChangeCliente = (e) => {
        //console.log(e.target.value)
        //console.log(e.target.label)
        setpedido((prev) => ({
            ...prev,
            ["clienteId"]: e._id,
            ["cliente"]:e.cliente
        }));
    };
    const handleChangeClienteNuevo = (e) => {
        console.log(e.target.value);
        setClienteNuevo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const handleChangedProducto = (e) => {
        if (e.target.value.length > 3) {
            const datasearch ={
                "empresaId": currentUser?.empresa[0]._id,
                "producto": e.target.value
            }
            productoDataService.getproductosearch(datasearch)
                .then(function (response) {
                    setProductoSel(response.data)
                    console.log(response)
                })
                .catch(e => {
                    console.log(e);
                });
        }
    };
   
    function crearcliente(){
        //let cliente = document.getElementById("ncliente")
        console.log(clientenuevo)
        clienteDataService.createcliente(clientenuevo)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            clienteDataService.getcliente(currentUser.empresa[0]._id)
            .then(response => response.json())
            .then(response => {
                setCliente(response)
                //console.log(response)
            })
            
        })
    }
    useEffect(() => {
        const fecha = new Date();
        pedido.fecha = moment().format('yyyy-M-DD')
        pedido.moneda = "PEN"
        pedidoDataService.getpedidocorrelativo(currentUser?.empresa[0]._id)
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
        clienteDataService.getcliente(currentUser?.empresa[0]._id)
            .then(response => response.json())
            .then(response => {
                setCliente(response)
                //console.log(response)
            })
        
    }, []);

    const handleProductoDetalleChange = (detalle) => {
        //setventa(prev => ({ ...prev, detalle }));
         setDetalle(  detalle );
 
     };
     const calcularTotal = () => {
         return detalle.reduce((total, item) => total + (item.cantidad * item.precio_unitario), 0);
     };
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="card card-custom">
                    <div className="card-header align-items-center py-5 gap-2 gap-md-5">
                        <div className="card-title">
                            <div className="d-flex align-items-center position-relative my-1">
                                <h2>Registrar Pedido</h2>
                            </div>
                        </div>
                        <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                                    <button type="button" className="btn   btn-secondary btn-sm" 
                                    data-bs-toggle="modal" data-bs-target="#kt_modal_1">
                                    <i className="fa-solid fa-user-plus fs-1x"></i>
                                    Cliente
                                    </button>
                            <Link to={"/pedido"}
                                className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                                <i className="fa-solid fa-reply "></i>
                                Volver
                            </Link>
                            <button className='btn btn-primary btn-sm' type="submit">
                                <i className="fa-solid fa-floppy-disk"></i>
                                Guardar</button>

                        </div>
                    </div>

                    <div className="card-body ">
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
                                    <input type="date" name="fecha" required defaultValue={pedido.fecha}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Vendedor</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="vendedorId">
                                        <option value="">[Seleccione]</option>
                                         <DDlPersonal puesto="vendedor" empresaId={currentUser.empresa[0]._id} />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Moneda</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="moneda">
                                        <option value="">[Seleccione]</option>
                                       <DDlParametro dominio="moneda" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-12  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Cliente</label>
                                     
                                    <Select required placeholder="Seleccione Cliente"
                                        name="_id"  
                                        options={cliente}
                                        onChange={(e) => handleChangeCliente(e)}
                                        getOptionValue={option => option._id}
                                        getOptionLabel={option => option.cliente}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ProductoDetalle onProductoChange={handleProductoDetalleChange}></ProductoDetalle>

                <div className="row">
                    <div className="col">
                        <div className="col-lg-12  input-group-sm mb-5">
                            <div className="  mb-2">
                                <label className="form-label" id="inputGroup-sizing-sm">Observaciones</label>
                                <textarea rows={4}  name="observaciones"  defaultValue={pedido.observacion}
                                className="form-control" onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                   
                    
                </div>
              
            </form>
            

<div className="modal fade"  id="kt_modal_1">
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <h3 className="modal-title">Nuevo Cliente</h3>

                <div className="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                    <i className="ki-duotone ki-cross fs-1"><span className="path1"></span><span className="path2"></span></i>
                </div>
            </div>

            <div className="modal-body">
                <form>
                <div className="form-group row">
                    <div className="col-lg-12  input-group-sm mb-5">
                        <div className="  mb-2">
                            <label className="form-label" id="inputGroup-sizing-sm">Cliente</label>
                            <input type="text" placeholder="Apellidos y Nombres" name="cliente" 
                            id="cliente" onChange={handleChangeClienteNuevo} className="form-control"  />
                        </div>
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-lg-12  input-group-sm mb-5">
                        <div className="  mb-2">
                            <label className="form-label" id="inputGroup-sizing-sm">Cliente</label>
                            <input type="text" placeholder="Teléfono" name="telefono" 
                            id="cliente" onChange={handleChangeClienteNuevo} className="form-control"  />
                        </div>
                    </div>
                </div>
                </form>
            </div>

            <div className="modal-footer">
                <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={crearcliente}>Guardar Cliente</button>
            </div>
        </div>
    </div>
</div>
        </>
    );
}
