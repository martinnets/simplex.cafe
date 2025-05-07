
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import pagoDataService from "../../../_services/pago";
import proveedorDataService from "../../../_services/proveedor";

import { useAuth } from "../../modules/auth";
import { Pago } from "../../../_models/pago";
import moment from "moment";
import Select from 'react-select';
import { DDlProveedor } from "../../../_metronic/layout/components/select/proveedor";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import { Proveedor } from "../../../_models/proveedor";
import { DDlSucursal } from "../../../_metronic/layout/components/select/sucursal";

export default function PagoForm() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const [proveedornuevo, setProveedorNuevo] = useState<Proveedor>({});
    const inputRef = useRef(null);
    const inputRef2 = useRef(null);
    const queryParameters = new URLSearchParams(window.location.search)
    const idpago = queryParameters.get("id")
    const [pago, setpago] = useState<Pago>({});
    const [correlativo, setCorrelativo] = useState("");
    const [proveedor, setProveedor] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar el Registro?");
        if (answer) {
            console.log(pago);
            if (idpago == null) {
                pago.usu_crea = currentUser?.codigo
                pago.codigo_estado = '1'
                pago.empresaId = currentUser?.empresa[0]._id
                pago.fecha_programado = pago.fecha;
                pagoDataService.createpago(pago)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        //alert("Registro Insertado correctamente");
                        navigate('/pago');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                pago.usu_modi = currentUser?.codigo
                pago._id = idpago
                pagoDataService.updatepago(pago)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        //alert("Registro Actualizado correctamente");
                        navigate('/pago');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        }
    };
    const handleChange = (e) => {
        console.log();
        setpago((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const handleChangeProveedor = (e) => {
        //console.log();
        setpago((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    const handleChangeProveedorNuevo = (e) => {
        //console.log();
        setProveedorNuevo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    function crearproveedor() {
        if (proveedornuevo.proveedor === '' || proveedornuevo.proveedor === undefined) {
            console.log('no grabar')
        } else if (proveedornuevo.nro_doc === '' || proveedornuevo.nro_doc === undefined) {
            console.log('no grabar')
        } else {
            console.log(proveedornuevo)
            proveedorDataService.createproveedor(proveedornuevo)
                .then(function (response) {
                    console.log(response.data);
                    var sel = document.getElementById("proveedor");
                    var option = document.createElement("option");
                    option.value = response.data._id;
                    option.innerHTML = response.data.proveedor;
                    sel.appendChild(option);
                })
        }
    }
    function getcorrelativo() {

    }
    useEffect(() => {
        const fecha = new Date();
        pago.fecha = moment().format('yyyy-M-DD')
        pago.moneda = "PEN"
        if (idpago !== null) {
            pagoDataService.getpagoById(idpago)
                .then(response => response.json())
                .then(result => {
                    setpago(result);
                    console.log(result);
                })
                .catch(e => {
                    console.log(e);
                });
        } else {
           
            pagoDataService.getpagocorrelativo(currentUser?.empresa[0]._id)
                .then(response => response.json())
                .then(result => {
                    let scorrelativo = ''
                    if (result.length === 0) {
                        scorrelativo = '00000001'
                    } else {
                        scorrelativo = String(result[0].correlativo).padStart(8, '0')
                    }
                    setCorrelativo(scorrelativo)
                    pago.correlativo = scorrelativo
                })
        }
    }, []);
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-light-danger">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-dark">Registro de Pago</h3>
                        <span className="text-dark">Detalle
                        </span>
                    </div>
                    <div className="d-flex   flex-row-fluid justify-content-end">
                        <button type="button" className="btn   btn-secondary btn-sm"
                            data-bs-toggle="modal" data-bs-target="#kt_modal_1">
                            <i className="fa-solid fa-user-plus fs-1x"></i>
                            Proveedor
                        </button>
                        <Link to={"/pago"}
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
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Nro Pago</label>
                                    <input type="text" name="pago" readOnly defaultValue={pago.correlativo}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Fecha</label>
                                    <input type="date" name="fecha" defaultValue={pago.fecha}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Método de Pago</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="metodo_pago" value={pago.metodo_pago}>
                                        <option value="">[Seleccione]</option>

                                        <DDlParametro dominio="metodo_pago" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Moneda</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="moneda" value={pago.moneda}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="moneda" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Cuenta</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="cuenta" value={pago.cuenta}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="cuenta" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Categoria</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="categoria" value={pago.categoria}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="categoria" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-6  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Concepto</label>
                                    <input type="text" name="concepto" defaultValue={pago.concepto}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Proveedor</label>
                                    <select className="form-control" required onChange={handleChangeProveedor}
                                        name="proveedorId" id="proveedor" value={pago.proveedorId}>
                                        <option value="">[Seleccione]</option>
                                        <DDlProveedor empresaId={currentUser?.empresa[0]._id} />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Importe</label>
                                    <input type="text" name="importe" placeholder="0.00" required defaultValue={pago.importe}
                                        className="form-control text-end bg-light-primary" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Tipo Documento</label>
                                    <select className="form-control" onChange={handleChange}
                                        name="tipo_doc_pago" value={pago.tipo_doc_pago}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="tipo_doc_pago" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Número Documento</label>
                                    <input type="text" name="num_doc" defaultValue={pago.num_doc}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Tipo de Pago</label>
                                    <select className="form-control" onChange={handleChange}
                                        name="tipo_pago" value={pago.tipo_pago}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="tipo_pago" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Sucursal</label>
                                    <select className="form-control"  onChange={handleChange}
                                        name="sucursalId">
                                        <option value="">[Seleccione]</option>
                                        <DDlSucursal empresaId={currentUser.empresa[0]._id} />
                                    </select>
                                </div>
                            </div>


                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Referencia</label>
                                    <input type="text" name="referencia" defaultValue={pago.referencia}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-9  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Observación</label>
                                    <input type="text" name="observacion" defaultValue={pago.observacion}
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
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal"
                                onClick={crearproveedor}>Guardar Proveedor</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
