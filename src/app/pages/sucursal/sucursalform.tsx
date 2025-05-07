
import React, { useEffect,useState} from "react";
import { Link ,useNavigate} from "react-router-dom";
import sucursalDataService from "../../../_services/sucursal";
import { useAuth } from "../../modules/auth";
import { Sucursal } from "../../../_models/sucursal";



export default function SucursalForm()  {
  const { currentUser } = useAuth()
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search)
  const idsucursal = queryParameters.get("id")
  const [sucursal, setsucursal] = useState<Sucursal>({});
  const handleSubmit = async (e ) => {
            e.preventDefault();
            const answer = window.confirm("Esta seguro de Guardar el Registro?");
            if (answer) {
              
              if (idsucursal  == null){
                sucursal.usu_crea = currentUser?.codigo
                sucursal.codigo_estado = '1'
                sucursal.empresaId=currentUser.empresa[0]._id
                console.log(sucursal);
                sucursalDataService.createsucursal(sucursal)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Insertado correctamente");
                      navigate('/sucursal');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
              } else {
                sucursal.usu_modi = currentUser?.codigo
                sucursal._id=idsucursal
                sucursalDataService.updatesucursal(idsucursal,sucursal)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Actualizado correctamente");
                      navigate('/sucursal');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
               
              }
            }
    };
    const handleChange = (e ) => {
        console.log();
        setsucursal((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    useEffect(() => {
        if (idsucursal  !== null){
             sucursalDataService.getsucursalById(idsucursal)
                .then(response => response.json())
                .then(result => {
                    setsucursal(result);
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
                        <h2>Editar sucursal</h2>
                    </div>
                </div>

                <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                    <Link to={"/sucursal"} 
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
                                         <input type="text" name="codigo"  defaultValue={sucursal.codigo} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">descripcion</label>
                                         <input type="text" name="descripcion"  defaultValue={sucursal.descripcion} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">direccion</label>
                                         <input type="text" name="direccion"  defaultValue={sucursal.direccion} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">telefono</label>
                                         <input type="text" name="telefono"  defaultValue={sucursal.telefono} 
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
