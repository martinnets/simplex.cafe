
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ventaDataService from "../../../_services/venta";
import { useAuth } from "../../modules/auth";
import { Venta } from "../../../_models/venta";
import clienteDataService from "../../../_services/cliente";
import pedidoDataService from "../../../_services/pedido";
import Select from 'react-select';
import { Cliente } from "../../../_models/cliente";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import { DDlPersonal } from "../../../_metronic/layout/components/select/personal";
import ProductoDetalle from "../../../_metronic/layout/components/select/productodetalle";

export default function VentaForm() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const idpedido = queryParameters.get("id")
    const [venta, setventa] = useState<Venta>(
        {moneda:'PEN',
        fecha: new Date().toISOString().split('T')[0],
        vencimiento: new Date().toISOString().split('T')[0]});
     const [cliente, setCliente] = useState([]);
    const [clientenuevo, setClienteNuevo] = useState<Cliente>({});
     const [subtotal, setSubTotal] = useState(0);
    const [igv, setIGV] = useState(0);
    const [total, setTotal] = useState(0);
    const [correlativo, setCorrelativo] = useState("");
       const [ventadet, setVentaDet] = useState([]); //Productos de la Venta
        
    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar la Venta?");
        if (answer) {
            if (venta.detalle !== null) {
                venta.usu_crea = currentUser?.codigo
                venta.codigo_estado = '1'
                //venta.pedido = correlativo
                venta.subtotal = calcularTotal()-(calcularTotal()/1.18)
                venta.igv = calcularTotal()/1.18
                venta.total = calcularTotal()
                venta.cobrado = 0
                venta.porcobrar = calcularTotal()
                venta.empresaId= currentUser?.empresa[0]._id
                venta.detalle=ventadet
                venta.numero=correlativo
                
                console.log(venta);

                ventaDataService.createventa(venta)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                          
                        alert("Registro Insertado correctamente");
                        navigate('/venta');
                    })
            } else {
                alert("Debe agregar al menos un detalle al pedido")
            }

        }
    };
    const handleChange = (e) => {
        console.log();
        setventa((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const handleChangeCorrelativo = (e) => {
        console.log();
        setventa((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        const datacorrelativo={
            'empresaId':currentUser?.empresa[0]._id,
            'tipo_doc':'01',
           'serie':'F001'
        }
        ventaDataService.createventacorrelativo(datacorrelativo)
            .then(function (response) {
                //console.log(response.data);
                console.log(response.data[0].correlativo);

                let scorrelativo = ''
                if (response.data.length===0){
                    scorrelativo='00000001'
                }else {
                    scorrelativo=String(response.data[0].correlativo).padStart(8, '0')
                }
                console.log(scorrelativo);
                setCorrelativo(scorrelativo)
            })
    };
    const handleChangeCliente = (e) => {
        //console.log(e.target.value)
        //console.log(e.target.label)
        setventa((prev) => ({
            ...prev,
            ["clienteId"]: e._id,
            ["cliente"]:e.cliente
        }));
    };
    const handleChangeClienteNuevo = (e) => {
        //console.log();
        setClienteNuevo((prev) => ({
            [e.target.name]: e.target.value,
        }));
    };
    
    function crearcliente(){
       if (clientenuevo.nro_doc!=''){
        clienteDataService.createcliente(clientenuevo)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            clienteDataService.getcliente(currentUser?.empresa[0]._id)
            .then(response => response.json())
            .then(response => {
                setCliente(response)
                //console.log(response)
            })
            
        })
       }
        
       
    }
    useEffect(() => {
       
        clienteDataService.getcliente(currentUser?.empresa[0]._id)
            .then(response => response.json())
            .then(response => {
                setCliente(response)
                //console.log(response)
            })
        
        if (idpedido  !== null){
            pedidoDataService.getpedidoById(idpedido)
            .then(response => response.json())
            .then(response => {
                setventa(response)
                console.log(response)
                
                //console.log(response)
            })
        }
        
    }, []);
    const handleProductoDetalleChange = (detalle) => {
       //setventa(prev => ({ ...prev, detalle }));
        setVentaDet(  detalle );

    };
    const calcularTotal = () => {
        return ventadet.reduce((total, item) => total + (item.cantidad * item.precio_unitario), 0);
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
            <div className="alert alert-secondary d-flex align-items-center p-5 bg-light-primary">
            <div className="d-flex flex-column">
                        <h3 className="mb-1 text-dark">Registro de Venta</h3>
                        <span className="text-dark">Detalle</span>
                    </div>
                    <div className="d-flex   flex-row-fluid justify-content-end">
                    <button type="button" className="btn   btn-secondary btn-sm" 
                        data-bs-toggle="modal" data-bs-target="#kt_modal_1">
                                    <i className="fa-solid fa-user-plus fs-1x"></i>
                                    Cliente
                                    </button>
                        <Link to={"/venta"}
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
                                        <div className="col-lg-3  input-group-sm mb-5">
                                            <div className="  mb-2">
                                                <label className="form-label" id="inputGroup-sizing-sm">Fecha Emisión</label>
                                                <input type="date" name="fecha" required defaultValue={venta.fecha}
                                                    className="form-control" onChange={handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-lg-3  input-group-sm mb-5">
                                            <div className="  mb-2">
                                                <label className="form-label" id="inputGroup-sizing-sm">Fecha Vencimiento</label>
                                                <input type="date" name="vencimiento" required 
                                                defaultValue={venta.vencimiento}
                                                    className="form-control" onChange={handleChange} />
                                            </div>
                                        </div>
                                        
                                        <div className="col-lg-3  input-group-sm mb-5">
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
                                        <div className="col-lg-3  input-group-sm mb-5">
                                            <div className="  mb-2">
                                                <label className="form-label" id="inputGroup-sizing-sm">Moneda</label>
                                                <select className="form-control" required onChange={handleChange}
                                                    name="moneda" value={venta.moneda} >
                                                    <option value="">[Seleccione]</option>
                                                   <DDlParametro dominio="moneda" />
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-lg-6  input-group-sm mb-5">
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

                                        <div className="col-lg-6  input-group-sm mb-5">
                                            <div className="  mb-2">
                                                <label className="form-label" id="inputGroup-sizing-sm">Vendedor</label>
                                                <select className="form-control" required onChange={handleChange}
                                                    name="vendedor">
                                                    <option value="">[Seleccione]</option>
                                                    <DDlPersonal puesto="vendedor" empresaId={currentUser.empresa[0]._id} />
                                                </select>
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-2 flex-grow-2 bd-highlight">
                            <div className="card ">
                                <div className="card-body ">   
                                    <div className="col-lg-12   ">
                                        <div className="  mb-2">
                                            <label className="form-label" >Tipo Documento</label>
                                            <select className="form-control" required onChange={handleChange} 
                                                    name="tipo_doc">
                                                <option value="">[Seleccione]</option>
                                                  <DDlParametro dominio="tipo_comprobante" />
                                            </select>
                                        </div>
                                    </div>                                  
                                    <div className="col-lg-12   ">
                                        <label className="form-label" >Serie-Numero</label>
                                        <select className="form-control" required onChange={handleChangeCorrelativo} 
                                            name="serie">
                                                <option value="">[Seleccione]</option>
                                                <option value="F001">F001</option> 
                                                <option value="E001">E001</option> 
                                        </select>
                                        <input type="text" name="numero"   required defaultValue={correlativo}
                                        className="form-control" onChange={handleChange} />
                                    </div>  
                                                                      
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

               
                <ProductoDetalle onProductoChange={handleProductoDetalleChange}></ProductoDetalle>
               
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
                 
                    <div className="col-lg-12  input-group-sm mb-5">
                        <div className="  mb-2">
                            <label className="form-label" id="inputGroup-sizing-sm">Teléfono</label>
                            <input type="text" placeholder="Teléfono" name="telefono" 
                           onChange={handleChangeClienteNuevo} className="form-control"  />
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
