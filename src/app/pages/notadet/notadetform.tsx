
import React, { useEffect,useState} from "react";
import { Link ,useNavigate} from "react-router-dom";
import notadetDataService from "../../../_services/notadet";
import { useAuth } from "../../modules/auth";
import { Notadet } from "../../../_models/notadet";



export default function NotadetForm()  {
  const { currentUser } = useAuth()
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search)
  const idnotadet = queryParameters.get("id")
  const [notadet, setnotadet] = useState<Notadet>({});
  const handleSubmit = async (e ) => {
            e.preventDefault();
            const answer = window.confirm("Esta seguro de Guardar el Registro?");
            if (answer) {
              console.log(notadet);
              if (idnotadet  == null){
                notadet.usu_crea = currentUser?.codigo
                notadet.codigo_estado = '1'
                notadetDataService.createnotadet(notadet)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Insertado correctamente");
                      navigate('/notadet');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
              } else {
                notadet.usu_modi = currentUser?.codigo
                notadet._id=idnotadet
                notadetDataService.updatenotadet(notadet)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Actualizado correctamente");
                      navigate('/notadet');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
               
              }
            }
    };
    const handleChange = (e ) => {
        console.log();
        setnotadet((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    useEffect(() => {
        if (idnotadet  !== null){
             notadetDataService.getnotadetById(idnotadet)
                .then(response => response.json())
                .then(result => {
                    setnotadet(result);
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
                        <h2>Editar notadet</h2>
                    </div>
                </div>

                <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                    <Link to={"/notadet"} 
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
                                    <label className="form-label" id="inputGroup-sizing-sm">nota</label>
                                         <input type="text" name="nota"  defaultValue={notadet.nota} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">productoId</label>
                                         <input type="text" name="productoId"  defaultValue={notadet.productoId} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">producto</label>
                                         <input type="text" name="producto"  defaultValue={notadet.producto} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">cantidad</label>
                                         <input type="text" name="cantidad"  defaultValue={notadet.cantidad} 
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
                                    <label className="form-label" id="inputGroup-sizing-sm">total</label>
                                         <input type="text" name="total"  defaultValue={notadet.total} 
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
