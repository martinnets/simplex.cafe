
import React, { useEffect,useState} from "react";
import { Link ,useNavigate} from "react-router-dom";
import dominioDataService from "../../../_services/dominio";
import { useAuth } from "../../modules/auth";

import { Dominio } from "../../../_models/dominio";



export default function DominioForm()  {
  const { currentUser } = useAuth()
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search)
  const iddominio = queryParameters.get("id")
  const [dominio, setdominio] = useState<Dominio>({});
  const handleSubmit = async (e ) => {
            e.preventDefault();
            const answer = window.confirm("Esta seguro de Guardar el Registro?");
            if (answer) {
              console.log(dominio);
              if (iddominio  == null){
                dominio.usu_crea = currentUser?.codigo
                dominio.codigo_estado = '1'
                dominio.empresaId= currentUser?.empresa[0]._id
                dominioDataService.createdominio(dominio)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Insertado correctamente");
                      navigate('/dominio');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
              } else {
                dominio.usu_modi = currentUser?.codigo
                dominioDataService.updatedominio(dominio)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Actualizado correctamente");
                      navigate('/dominio');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
               
              }
            }
    };
    const handleChange = (e ) => {
        console.log();
        setdominio((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    useEffect(() => {
        if (iddominio  !== null){
             dominioDataService.getdominioById(iddominio)
                .then(response => response.json())
                .then(result => {
                    setdominio(result);
                    console.log(result);
                })
                .catch(e => {
                console.log(e);
                });
            }
        }, []);
    return (
            <>
             <form   onSubmit={handleSubmit}>
            <div className="card card-custom">
            <div className="card-header align-items-center py-5 gap-2 gap-md-5">
                <div className="card-title">
                    <div className="d-flex align-items-center position-relative my-1">
                        <h2>Editar dominio</h2>
                    </div>
                </div>

                <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                    <Link to={"/dominio"} 
                            className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                            <i className="fa-solid fa-reply "></i>
                            Volver
                            </Link>
                            <button className='btn btn-primary btn-sm' type="submit">
                            <i className="fa-solid fa-floppy-disk"></i>
                            Guardar</button>
                            
                </div>
            </div>
            <div className="separator separator-dashed border-danger my-1"></div>
            <div className="card-body pt-10">
                <div className="form-group row">
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">codigo</label>
                                         <input type="text" name="codigo"  required defaultValue={dominio.codigo} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">dominio</label>
                                         <input type="text" name="dominio"  required defaultValue={dominio.dominio} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                </div>
            </div>
        </div>
        </form>
        </>
        );
    }
