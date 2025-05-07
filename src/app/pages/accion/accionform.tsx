import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import accionDataService from "../../../_services/accion";
import { useAuth } from "../../modules/auth";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import { Accion } from "../../../_models/accion";
import { DDlLead } from "../../../_metronic/layout/components/select/lead";
import { DDLOportunidad } from "../../../_metronic/layout/components/select/oportunidad";
import { DDlPersonal } from "../../../_metronic/layout/components/select/personal";
export default function AccionForm() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const idaccion = queryParameters.get("id")
    const [accion, setaccion] = useState<Accion>({});
    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar el Registro?");
        if (answer) {
            console.log(accion);
            if (idaccion == null) {
                accion.usu_crea = currentUser?.codigo
                accion.codigo_estado = '1'
                accion.empresaId = currentUser?.empresa[0]._id
                accionDataService.createaccion(accion)

                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Insertado correctamente");
                        navigate('/accion');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                accion.usu_modi = currentUser?.codigo
                accion._id = idaccion
                accionDataService.updateaccion(idaccion, accion)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Actualizado correctamente");
                        navigate('/accion');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        }
    };
    const handleChange = (e) => {
        console.log();
        setaccion((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    useEffect(() => {
        if (idaccion !== null) {
            accionDataService.getaccionById(idaccion)
                .then(response => response.json())
                .then(result => {
                    setaccion(result);
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
                        <h3 className="mb-1 text-dark">Registro de accion</h3>
                        <span className="text-dark">Detalle
                        </span>
                    </div>
                    <div className="d-flex   flex-row-fluid justify-content-end">

                        <Link to={"/accion"}
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
                                    <label className="form-label" id="inputGroup-sizing-sm">Asunto</label>
                                    <input type="text" name="asunto" defaultValue={accion.asunto}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Tipo Acción</label>
                                    <select className="form-control" onChange={handleChange}
                                        name="tipo_accion" value={accion.tipo_accion}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="tipo_accion" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-12  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Descripción</label>
                                    <input type="text" name="descripcion" defaultValue={accion.descripcion}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Fecha Inicio</label>
                                    <input type="date" name="fecha_inicio" defaultValue={accion.fecha_inicio}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Hora Inicio</label>
                                    <input type="time" name="hora_inicio" defaultValue={accion.hora_inicio}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Fecha Fin</label>
                                    <input type="date" name="fecha_fin" defaultValue={accion.fecha_fin}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Hora Fin</label>
                                    <input type="time" name="hora_fin" defaultValue={accion.hora_fin}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Lead</label>
                                    <select className="form-control"  onChange={handleChange}
                                        name="leadId" value={accion.leadId}>
                                        <option value="">[Seleccione]</option>
                                        <DDlLead empresaId={currentUser.empresa[0]._id} />  
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Oportunidad</label>
                                    <select className="form-control"  onChange={handleChange}
                                        name="leadId" value={accion.oportunidadId}>
                                        <option value="">[Seleccione]</option>
                                        <DDLOportunidad empresaId={currentUser.empresa[0]._id} />  
                                    </select>
                                </div>
                            </div>
                          
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Prioridad</label>
                                    <select className="form-control" onChange={handleChange}
                                        name="prioridad" value={accion.prioridad}>
                                        <option value="">[Seleccione]</option>
                                        <option value="alta">Alta</option>
                                        <option value="media">Media</option>
                                        <option value="baja">Baja</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Responsable</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="responsableId" value={accion.responsableId}>
                                        <option value="">[Seleccione]</option>
                                        <DDlPersonal puesto="comercial" empresaId={currentUser.empresa[0]._id} />  
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-12  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Comentarios</label>
                                    <input type="text" name="comentarios" defaultValue={accion.comentarios}
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
