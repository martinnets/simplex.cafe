import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import leadDataService from "../../../_services/lead";
import { useAuth } from "../../modules/auth";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import { Lead } from "../../../_models/lead";
import { DDlPersonal } from "../../../_metronic/layout/components/select/personal";
export default function LeadForm() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const idlead = queryParameters.get("id")
    const [lead, setlead] = useState<Lead>({});
    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar el Registro?");
        if (answer) {
            console.log(lead);
            if (idlead == null) {
                lead.usu_crea = currentUser?.codigo
                lead.codigo_estado = '1'
                lead.empresaId = currentUser?.empresa[0]._id
                leadDataService.createlead(lead)

                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Insertado correctamente");
                        navigate('/lead');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                lead.usu_modi = currentUser?.codigo
                lead._id = idlead
                leadDataService.updatelead(idlead, lead)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Actualizado correctamente");
                        navigate('/lead');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        }
    };
    const handleChange = (e) => {
        console.log();
        setlead((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    useEffect(() => {
        if (idlead !== null) {
            leadDataService.getleadById(idlead)
                .then(response => response.json())
                .then(result => {
                    setlead(result);
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
                        <h3 className="mb-1 text-dark">Registro de Lead</h3>
                        <span className="text-dark">Detalle
                        </span>
                    </div>
                    <div className="d-flex   flex-row-fluid justify-content-end">

                        <Link to={"/lead"}
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
                                    <label className="form-label" id="inputGroup-sizing-sm">Nombre Completo</label>
                                    <input type="text" name="nombre_completo" defaultValue={lead.nombre_completo}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Etapa Lead</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="etapa_lead" value={lead.etapa_lead}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="etapa_lead" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Teléfono</label>
                                    <input type="text" name="telefono" defaultValue={lead.telefono}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">email</label>
                                    <input type="email" name="email" defaultValue={lead.email}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                           
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Empresa</label>
                                    <input type="text" name="empresa" defaultValue={lead.empresa}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Cargo</label>
                                    <input type="text" name="cargo" defaultValue={lead.cargo}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Fuente</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="fuente" value={lead.fuente}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="fuente" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Nivel  de Interes</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="nivel_interes" value={lead.nivel_interes}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="nivel_interes" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Presupuesto Estimado</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="presupuesto" value={lead.presupuesto_estimado}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="presupuesto" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Moneda</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="moneda" value={lead.moneda}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="moneda" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Personal</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="personalId" value={lead.personalId}>
                                        <option value="">[Seleccione]</option>
                                        <DDlPersonal puesto="comercial" empresaId={currentUser.empresa[0]._id} />  
                                    </select>
                                      
                                </div>
                            </div>
                            <div className="col-lg-9  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Comentarios</label>
                                    <input type="text" name="comentarios" defaultValue={lead.comentarios}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
