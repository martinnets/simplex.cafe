
import React, { useEffect,useState} from "react";
import { Link ,useNavigate} from "react-router-dom";
import ordendetDataService from "../../../_services/ordendet";
import { useAuth } from "../../modules/auth";
import { Ordendet } from "../../../_models/ordendet";



export default function OrdendetForm()  {
  const { currentUser } = useAuth()
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search)
  const idordendet = queryParameters.get("id")
  const [ordendet, setordendet] = useState<Ordendet>({});
  const handleSubmit = async (e ) => {
            e.preventDefault();
            const answer = window.confirm("Esta seguro de Guardar el Registro?");
            if (answer) {
              console.log(ordendet);
              if (idordendet  == null){
                ordendet.usu_crea = currentUser?.codigo
                ordendet.codigo_estado = '1'
                ordendetDataService.createordendet(ordendet)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Insertado correctamente");
                      navigate('/ordendet');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
              } else {
                ordendet.usu_modi = currentUser?.codigo
                ordendet._id=idordendet
                ordendetDataService.updateordendet(ordendet)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Actualizado correctamente");
                      navigate('/ordendet');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
               
              }
            }
    };
    const handleChange = (e ) => {
        console.log();
        setordendet((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    useEffect(() => {
        if (idordendet  !== null){
             ordendetDataService.getordendetById(idordendet)
                .then(response => response.json())
                .then(result => {
                    setordendet(result);
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
                        <h2>Editar ordendet</h2>
                    </div>
                </div>

                <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                    <Link to={"/ordendet"} 
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
                                    <label className="form-label" id="inputGroup-sizing-sm">orden</label>
                                         <input type="text" name="orden"  defaultValue={ordendet.orden} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">productoId</label>
                                         <input type="text" name="productoId"  defaultValue={ordendet.productoId} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">producto</label>
                                         <input type="text" name="producto"  defaultValue={ordendet.producto} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">cantidad</label>
                                         <input type="text" name="cantidad"  defaultValue={ordendet.cantidad} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">precio_unitario</label>
                                         <select className="form-control" onChange={handleChange} 
                                            name="precio_unitario">
                                           <option value="">[Seleccione]</option>
                                            <option value="">Valor</option> 
                                        </select>
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">subtotal</label>
                                         <input type="text" name="subtotal"  defaultValue={ordendet.subtotal} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">igv</label>
                                         <input type="text" name="igv"  defaultValue={ordendet.igv} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">total</label>
                                         <input type="text" name="total"  defaultValue={ordendet.total} 
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
