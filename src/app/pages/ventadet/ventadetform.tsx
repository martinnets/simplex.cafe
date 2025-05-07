
import React, { useEffect,useState} from "react";
import { Link ,useNavigate} from "react-router-dom";
import ventadetDataService from "../../../_services/ventadet";
import { useAuth } from "../../modules/auth";
import { Ventadet } from "../../../_models/ventadet";



export default function VentadetForm()  {
  const { currentUser } = useAuth()
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search)
  const idventadet = queryParameters.get("id")
  const [ventadet, setventadet] = useState<Ventadet>({});
  const handleSubmit = async (e ) => {
            e.preventDefault();
            const answer = window.confirm("Esta seguro de Guardar el Registro?");
            if (answer) {
              console.log(ventadet);
              if (idventadet  == null){
                ventadet.usu_crea = currentUser?.codigo
                ventadet.codigo_estado = '1'
                ventadetDataService.createventadet(ventadet)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Insertado correctamente");
                      navigate('/ventadet');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
              } else {
                ventadet.usu_modi = currentUser?.codigo
                ventadet._id=idventadet
                ventadetDataService.updateventadet(ventadet)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Actualizado correctamente");
                      navigate('/ventadet');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
               
              }
            }
    };
    const handleChange = (e ) => {
        console.log();
        setventadet((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    useEffect(() => {
        if (idventadet  !== null){
             ventadetDataService.getventadetById(idventadet)
                .then(response => response.json())
                .then(result => {
                    setventadet(result);
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
                        <h2>Editar ventadet</h2>
                    </div>
                </div>

                <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                    <Link to={"/ventadet"} 
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
                                    <label className="form-label" id="inputGroup-sizing-sm">producto</label>
                                         <input type="text" name="producto"  defaultValue={ventadet.producto} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">cantidad</label>
                                         <input type="text" name="cantidad"  defaultValue={ventadet.cantidad} 
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
                                         <input type="text" name="subtotal"  defaultValue={ventadet.subtotal} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">impuesto</label>
                                         <input type="text" name="impuesto"  defaultValue={ventadet.igv} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">total</label>
                                         <input type="text" name="total"  defaultValue={ventadet.total} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">venta</label>
                                         <input type="text" name="venta"  defaultValue={ventadet.venta} 
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
