
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import parametroDataService from "../../../_services/parametro";
import { useAuth } from "../../modules/auth";
import { Parametro } from "../../../_models/parametro";


export default function ParametroForm() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const idparametro = queryParameters.get("id")
    const iddominio = queryParameters.get("d")
    const [parametro, setparametro] = useState<Parametro>({});
    const [pardominio, setParDominio] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar el Registro?");
        if (answer) {
            console.log(parametro);
            if (idparametro == null) {
                parametro.dominio=pardominio
                parametro.usu_crea = currentUser?.codigo
                parametro.codigo_estado = '1'
                parametro.empresaId = currentUser?.empresa[0]._id
                parametroDataService.createparametro(parametro)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Insertado correctamente");
                        navigate('/dominio/'+iddominio,{ state:pardominio});
                        

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                parametro.usu_modi = currentUser?.codigo
                parametro._id = idparametro
                parametroDataService.updateparametro(idparametro, parametro)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Actualizado correctamente");
                        navigate('/dominio/'+iddominio);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        }
    };
    const handleChange = (e) => {
        console.log();
        setparametro((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    useEffect(() => {
        if (iddominio !== null) {
            setParDominio(iddominio)
        }
        if (idparametro !== null) {
            parametroDataService.getparametroById(idparametro)
                .then(response => response.json())
                .then(result => {
                    setparametro(result);
                    setParDominio(result.dominio)
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
                <div className="card card-custom">
                    <div className="card-header align-items-center py-5 gap-2 gap-md-5">
                        <div className="card-title">
                            <div className="d-flex align-items-center position-relative my-1">
                                <h2>Editar parametro</h2>
                            </div>
                        </div>

                        <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                            <Link to={"/dominio/" + pardominio} state={pardominio}
                                className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                                <i className="fa-solid fa-reply "></i>
                                Volver
                            </Link>
                            <button className='btn btn-primary btn-sm' type="submit">
                                <i className="fa-solid fa-floppy-disk"></i>
                                Guardar</button>

                        </div>
                    </div>
                    <div className="separator border-primary my-1"></div>
                    <div className="card-body pt-10">
                        <div className="form-group row">
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Codigo</label>
                                    <input type="text" name="codigo" placeholder="Codigo en minusculas y sin espacio" required defaultValue={parametro.codigo}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Parametro</label>
                                    <input type="text" name="parametro" required defaultValue={parametro.parametro}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Tabla</label>
                                    <input type="text"  readOnly defaultValue={pardominio}
                                        className="form-control"  />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
