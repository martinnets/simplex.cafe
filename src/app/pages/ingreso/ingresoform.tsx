
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ingresoDataService from "../../../_services/ingreso";
import clienteDataService from "../../../_services/cliente";
import { useAuth } from "../../modules/auth";
import { Ingreso } from "../../../_models/ingreso";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import { DDlCliente } from "../../../_metronic/layout/components/select/cliente";
import { Cliente } from "../../../_models/cliente";
import moment from "moment";
import { DDlSucursal } from "../../../_metronic/layout/components/select/sucursal";
export default function IngresoForm() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const idingreso = queryParameters.get("id")
    const [ingreso, setingreso] = useState<Ingreso>({});
    const [clientenuevo, setClienteNuevo] = useState<Cliente>({});

    const [correlativo, setCorrelativo] = useState("");
    const inputRef = useRef(null);
    const inputRef2 = useRef(null);
    const handleChangeCliente = (e) => {
        setingreso((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    const handleChangeClienteNuevo = (e) => {
        setClienteNuevo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar el Registro?");
        if (answer) {
            console.log(ingreso);
            if (idingreso == null) {
                ingreso.usu_crea = currentUser?.codigo
                ingreso.codigo_estado = '1'
                ingreso.empresaId = currentUser?.empresa[0]._id
                //ingreso.correlativo=correlativo
                ingresoDataService.createingreso(ingreso)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        //alert("Registro Insertado correctamente");
                        navigate('/ingreso');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                ingreso.usu_modi = currentUser?.codigo
                ingreso._id = idingreso
                ingresoDataService.updateingreso(ingreso)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        //alert("Registro Actualizado correctamente");
                        navigate('/ingreso');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        }
    };
    const handleChange = (e) => {
        console.log();
        setingreso((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    function crearcliente() {
        if (clientenuevo.cliente === '' || clientenuevo.cliente === undefined) {
            console.log('no grabar')
        } else if (clientenuevo.nro_doc === '' || clientenuevo.nro_doc === undefined) {
            console.log('no grabar')
        } else {
            console.log(clientenuevo)
            clientenuevo.usu_crea = currentUser?.codigo
            clientenuevo.codigo_estado = '1'
            clientenuevo.empresaId = currentUser?.empresa[0]._id
            clienteDataService.createcliente(clientenuevo)
                .then(function (response) {
                    console.log(response.data);
                    var sel = document.getElementById("cliente");
                    var option = document.createElement("option");
                    option.value = response.data._id;
                    option.innerHTML = response.data.cliente;
                    sel.appendChild(option);
                })
        }
    }

    useEffect(() => {
        const fecha = new Date();
        ingreso.fecha=moment().format('yyyy-M-DD')
        if (idingreso !== null) {
            ingresoDataService.getingresoById(idingreso)
                .then(response => response.json())
                .then(result => {
                    setingreso(result);
                    console.log(result);
                })
                .catch(e => {
                    console.log(e);
                });
        } else {
            const fecha = new Date();
            ingreso.fecha = moment().format('yyyy-M-DD')
            ingreso.moneda = "PEN"
            ingresoDataService.getingresocorrelativo(currentUser?.empresa[0]._id)
                .then(response => response.json())
                .then(result => {
                    console.log(result)
                    let scorrelativo = ''
                    if (result.length === 0) {
                        scorrelativo = '00000001'
                    } else {
                        scorrelativo = String(result[0].correlativo).padStart(8, '0')
                    }
                    setCorrelativo(scorrelativo)
                    ingreso.correlativo = scorrelativo
                })
        }

    }, []);
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-light-primary">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-dark">Registro de Ingreso</h3>
                        <span className="text-dark">Detalle
                        </span>
                    </div>
                    <div className="d-flex   flex-row-fluid justify-content-end">
                        <button type="button" className="btn   btn-secondary btn-sm"
                            data-bs-toggle="modal" data-bs-target="#kt_modal_1">
                            <i className="fa-solid fa-user-plus fs-1x"></i>
                            Cliente
                        </button>
                        <Link to={"/ingreso"}
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


                    <div className="card-body ">

                        <div className="form-group row">

                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" >Nro Recibo</label>
                                    <input type="text" name="correlativo" readOnly defaultValue={ingreso.correlativo}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" >Fecha</label>
                                    <input type="date" name="fecha" required defaultValue={ingreso.fecha}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" >Método de Pago</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="metodo_pago" value={ingreso.metodo_pago}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="metodo_pago" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" >Moneda</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="moneda" value={ingreso.moneda}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="moneda" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" >Categoria</label>
                                    <select className="form-control" onChange={handleChange}
                                        name="categoria" value={ingreso.categoria}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="categoria_ingreso" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" >Cuenta</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="cuenta" value={ingreso.cuenta}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="cuenta" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" >Concepto</label>
                                    <input type="text" name="concepto" required defaultValue={ingreso.concepto}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" >Cliente</label>
                                    <select className="form-control" required onChange={handleChangeCliente}
                                        name="clienteId" id="cliente" value={ingreso.clienteId}>
                                        <option value="">[Seleccione]</option>
                                        <DDlCliente empresaId={currentUser?.empresa[0]._id} />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" >Importe</label>
                                    <input type="number" name="importe" required defaultValue={ingreso.importe}
                                        className="form-control text-end bg-light-primary" onChange={handleChange} />
                                </div>
                            </div>

                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" >Tipo Documento</label>
                                    <select className="form-control" onChange={handleChange}
                                        name="tipo_doc_pago" value={ingreso.tipo_doc_pago}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="tipo_doc_pago" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" >Número Documento</label>
                                    <input type="text" name="num_doc" defaultValue={ingreso.num_doc}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Sucursal</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="sucursalId">
                                        <option value="">[Seleccione]</option>
                                        <DDlSucursal empresaId={currentUser.empresa[0]._id} />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-12  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" >Observación</label>
                                    <input type="text" name="observacion" defaultValue={ingreso.observacion}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div className="modal fade" id="kt_modal_1">
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
                                            <label className="form-label" >DNI</label>
                                            <input type="text" placeholder="Numero de Documento" name="nro_doc"
                                                ref={inputRef}
                                                onChange={handleChangeClienteNuevo} className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-lg-12  input-group-sm mb-5">
                                        <div className="  mb-2">
                                            <label className="form-label" >Cliente</label>
                                            <input type="text" placeholder="Cliente" name="cliente"
                                                ref={inputRef2}
                                                onChange={handleChangeClienteNuevo} className="form-control" />
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                                onClick={crearcliente}>Guardar Cliente</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
