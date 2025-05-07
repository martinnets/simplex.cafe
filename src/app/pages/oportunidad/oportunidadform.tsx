import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import oportunidadDataService from "../../../_services/oportunidad";
import { useAuth } from "../../modules/auth";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import { Oportunidad } from "../../../_models/oportunidad";
import { DDlPersonal } from "../../../_metronic/layout/components/select/personal";
import { DDlLead } from "../../../_metronic/layout/components/select/lead";
export default function OportunidadForm() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const idoportunidad = queryParameters.get("id")
    const [oportunidad, setoportunidad] = useState<Oportunidad>({});
    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar el Registro?");
        if (answer) {
            console.log(oportunidad);
            if (idoportunidad == null) {
                oportunidad.usu_crea = currentUser?.codigo
                oportunidad.codigo_estado = '1'
                oportunidad.empresaId = currentUser?.empresa[0]._id
                oportunidadDataService.createoportunidad(oportunidad)

                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Insertado correctamente");
                        navigate('/oportunidad');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                oportunidad.usu_modi = currentUser?.codigo
                oportunidad._id = idoportunidad
                oportunidadDataService.updateoportunidad(idoportunidad, oportunidad)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Actualizado correctamente");
                        navigate('/oportunidad');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        }
    };
    const handleChange = (e) => {
        console.log();
        setoportunidad((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    useEffect(() => {
        if (idoportunidad !== null) {
            oportunidadDataService.getoportunidadById(idoportunidad)
                .then(response => response.json())
                .then(result => {
                    setoportunidad(result);
                    console.log(result);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }, []);
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-light-primary">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-dark">Registro de oportunidad</h3>
                        <span className="text-dark">Detalle
                        </span>
                    </div>
                    <div className="d-flex   flex-row-fluid justify-content-end">

                        <Link to={"/oportunidad"}
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
                            <div className="col-lg-9  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Nombre de la Oportunidad</label>
                                    <input type="text" name="nombre" defaultValue={oportunidad.nombre}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Etapa</label>
                                    <select className="form-control" onChange={handleChange}
                                        name="etapa_oportunidad" value={oportunidad.etapa_oportunidad}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="etapa_oportunidad" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Lead</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="leadId" value={oportunidad.leadId}>
                                        <option value="">[Seleccione]</option>
                                        <DDlLead empresaId={currentUser.empresa[0]._id} />  
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Valor Estimado</label>
                                    <input type="number" name="valor_estimado" defaultValue={oportunidad.valor_estimado}
                                        className="form-control text-end" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Probabilidad(%)</label>
                                    <input type="number" name="probabilidad" defaultValue={oportunidad.probabilidad}
                                        className="form-control text-end" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Fecha Estimada</label>
                                    <input type="date" name="fechaestimada" defaultValue={oportunidad.fechaestimada}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                           
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Personal</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="personalId" value={oportunidad.personalId}>
                                        <option value="">[Seleccione]</option>
                                        <DDlPersonal puesto="comercial" empresaId={currentUser.empresa[0]._id} />  
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Moneda</label>
                                     <select className="form-control" required onChange={handleChange}
                                        name="moneda" value={oportunidad.moneda}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="moneda" />
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
