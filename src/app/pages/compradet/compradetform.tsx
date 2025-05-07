
import React, { useEffect,useState} from "react";
import { Link ,useNavigate} from "react-router-dom";
import compradetDataService from "../../../_services/compradet";
import { useAuth } from "../../modules/auth";
import { Compradet } from "../../../_models/compradet";



export default function CompradetForm()  {
  const { currentUser } = useAuth()
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search)
  const idcompradet = queryParameters.get("id")
  const [compradet, setcompradet] = useState<Compradet>({});
  const handleSubmit = async (e ) => {
            e.preventDefault();
            const answer = window.confirm("Esta seguro de Guardar el Registro?");
            if (answer) {
              console.log(compradet);
              if (idcompradet  == null){
                compradet.usu_crea = currentUser?.codigo
                compradet.codigo_estado = '1'
                compradetDataService.createcompradet(compradet)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Insertado correctamente");
                      navigate('/compradet');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
              } else {
                compradet.usu_modi = currentUser?.codigo
                compradet._id=idcompradet
                compradetDataService.updatecompradet(compradet)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Actualizado correctamente");
                      navigate('/compradet');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
               
              }
            }
    };
    const handleChange = (e ) => {
        console.log();
        setcompradet((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    useEffect(() => {
        if (idcompradet  !== null){
             compradetDataService.getcompradetById(idcompradet)
                .then(response => response.json())
                .then(result => {
                    setcompradet(result);
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
                        <h2>Editar compradet</h2>
                    </div>
                </div>

                <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                    <Link to={"/compradet"} 
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
                                    <label className="form-label" id="inputGroup-sizing-sm">productoId</label>
                                         <input type="text" name="productoId"  defaultValue={compradet.productoId} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">producto</label>
                                         <input type="text" name="producto"  defaultValue={compradet.producto} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">cantidad</label>
                                         <input type="text" name="cantidad"  defaultValue={compradet.cantidad} 
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
                                         <input type="text" name="subtotal"  defaultValue={compradet.subtotal} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">igv</label>
                                         <input type="text" name="igv"  defaultValue={compradet.igv} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">total</label>
                                         <input type="text" name="total"  defaultValue={compradet.total} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">compra</label>
                                         <input type="text" name="compra"  defaultValue={compradet.compra} 
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
