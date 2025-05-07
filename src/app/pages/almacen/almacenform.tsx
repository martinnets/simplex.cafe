
import React, { useEffect,useState} from "react";
import { Link ,useNavigate} from "react-router-dom";
import almacenDataService from "../../../_services/almacen";
import empresaDataService from "../../../_services/empresa";
import { useAuth } from "../../modules/auth";
import { Almacen } from "../../../_models/almacen";
import Select from 'react-select';
export default function AlmacenForm()  {
  const { currentUser } = useAuth()
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search)
  const idalmacen = queryParameters.get("id")
  const [almacen, setalmacen] = useState<Almacen>({});
  const [empresa, setEmpresa] = useState([]);
  const handleSubmit = async (e ) => {
            e.preventDefault();
            const answer = window.confirm("Esta seguro de Guardar el Registro?");
            if (answer) {
              console.log(almacen);
              if (idalmacen  == null){
                almacen.usu_crea = currentUser?.codigo
                almacen.codigo_estado = '1'
                almacen.empresaId= currentUser?.empresa[0]._id
                almacenDataService.createalmacen(almacen)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Insertado correctamente");
                      navigate('/almacen');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
              } else {
                almacen.usu_modi = currentUser?.codigo
                almacen._id=idalmacen
                almacenDataService.updatealmacen(idalmacen,almacen)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Actualizado correctamente");
                      navigate('/almacen');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
               
              }
            }
    };
    const handleChange = (e ) => {
        console.log();
        setalmacen((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const handleChangeEmpresa = (e) => {
        //console.log(e.target.value)
        //console.log(e.target.label)
        setalmacen((prev) => ({
            ...prev,
            ["empresaId"]: e._id,
            ["empresa"]: e.empresa,
        }));
        
    };
    useEffect(() => {
        if (idalmacen  !== null){
             almacenDataService.getalmacenById(idalmacen)
                .then(response => response.json())
                .then(result => {
                    setalmacen(result);
                    console.log(result);
                })
                .catch(e => {
                console.log(e);
                });
            }
            empresaDataService.getempresa()
            .then(response => response.json())
            .then(response => {
                setEmpresa(response)
                //console.log(response)
            })
        }, []);
    return (
            <>
             <form   onSubmit={handleSubmit}>
            <div className="card card-custom">
            <div className="card-header align-items-center py-5 gap-2 gap-md-5">
                <div className="card-title">
                    <div className="d-flex align-items-center position-relative my-1">
                        <h2>Editar almacen</h2>
                    </div>
                </div>

                <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                    <Link to={"/almacen"} 
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
                                    <label className="form-label" id="inputGroup-sizing-sm">Codigo</label>
                                         <input type="text" name="Codigo"  defaultValue={almacen.Codigo} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-8  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Almacen</label>
                                         <input type="text" name="almacen"  defaultValue={almacen.almacen} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-12  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Dirección</label>
                                         <input type="text" name="direccion"  defaultValue={almacen.direccion} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">telefono</label>
                                         <input type="text" name="telefono"  defaultValue={almacen.telefono} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">dpto</label>
                                         <input type="text" name="dpto"  defaultValue={almacen.dpto} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">prov</label>
                                         <input type="text" name="prov"  defaultValue={almacen.prov} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">distrito</label>
                                         <input type="text" name="distrito"  defaultValue={almacen.distrito} 
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
