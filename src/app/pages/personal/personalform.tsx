
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import personalDataService from "../../../_services/personal";
import { useAuth } from "../../modules/auth";
import { Personal } from "../../../_models/personal";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";



export default function PersonalForm() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const idpersonal = queryParameters.get("id")
    const [personal, setpersonal] = useState<Personal>({});
    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar el Registro?");
        if (answer) {
            console.log(personal);
            if (idpersonal == null) {
                personal.usu_crea = currentUser?.codigo
                personal.codigo_estado = '1'
                personal.empresaId = currentUser?.empresa[0]._id
                personalDataService.createpersonal(personal)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Insertado correctamente");
                        navigate('/personal');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                personal.usu_modi = currentUser?.codigo
                personal._id = idpersonal
                personalDataService.updatepersonal(idpersonal, personal)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Actualizado correctamente");
                        navigate('/personal');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        }
    };
    const handleChange = (e) => {
        console.log();
        setpersonal((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    useEffect(() => {
        if (idpersonal !== null) {
            personalDataService.getpersonalById(idpersonal)
                .then(response => response.json())
                .then(result => {
                    setpersonal(result);
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
                        <h3 className="mb-1 text-dark">Registro de Personal</h3>
                        <span className="text-dark">Detalle
                        </span>
                    </div>
                    <div className="d-flex   flex-row-fluid justify-content-end">

                        <Link to={"/personal"}
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
                                    <label className="form-label" id="inputGroup-sizing-sm">Código</label>
                                    <input type="text" name="codigo" defaultValue={personal.codigo}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Nombres </label>
                                    <input type="text" name="nombres" defaultValue={personal.nombres}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Apellidos</label>
                                    <input type="text" name="apellidos" defaultValue={personal.apellidos}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Email</label>
                                    <input type="email" name="correo" defaultValue={personal.correo}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Teléfono</label>
                                    <input type="text" name="telefono" defaultValue={personal.telefono}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Cargo</label>
                                    <select className="form-control" onChange={handleChange}
                                        name="cargo" value={personal.cargo}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="puesto" />
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
