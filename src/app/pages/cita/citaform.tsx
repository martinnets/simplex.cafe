
import React, { useEffect,useState} from "react";
import { Link ,useNavigate} from "react-router-dom";
import citaDataService from "../../../_services/cita";
import clienteDataService from "../../../_services/cliente";
import { useAuth } from "../../modules/auth";
import { Cita } from "../../../_models/cita";
import Select from 'react-select';
import moment from "moment";
import { DDlPersonal } from "../../../_metronic/layout/components/select/personal";
import { DDlSucursal } from "../../../_metronic/layout/components/select/sucursal";
 

export default function CitaForm()  {
  const { currentUser } = useAuth()
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search)
  const idcita = queryParameters.get("id")
  const [cita, setcita] = useState<Cita>({});
  const [cliente, setcliente] = useState([]);
 
  const handleSubmit = async (e ) => {
            e.preventDefault();
            const answer = window.confirm("Esta seguro de Guardar el Registro?");
            if (answer) {
              console.log(cita);
              if (idcita  == null){
                cita.usu_crea = currentUser?.codigo
                cita.codigo_estado = '1'
                cita.empresaId = currentUser?.empresa[0]._id
                citaDataService.createcita(cita)                
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Insertado correctamente");
                      navigate('/cita');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
              } else {
                cita.usu_modi = currentUser?.codigo
                cita._id=idcita
                citaDataService.updatecita(idcita,cita)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Actualizado correctamente");
                      navigate('/cita');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
               
              }
            }
    };
    const handleChange = (e ) => {
        console.log();
        setcita((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const handleChangeCliente = (e) => {
        //setElementoSel(e)
        console.log(e)

        setcita((prev) => ({
            ...prev,
            ["clienteId"]: e._id,
        }));
    };
    useEffect(() => {
        const fecha = new Date();
         
        cita.fecha_inicio=moment().format('yyyy-M-DD')
        if (idcita  !== null){
             citaDataService.getcitaById(idcita)
                .then(response => response.json())
                .then(result => {
                    setcita(result);
                    console.log(result);
                })
                .catch(e => {
                console.log(e);
                });
            }
            clienteDataService.getcliente(currentUser?.empresa[0]._id)
            .then(response => response.json())
            .then(response => {
                setcliente(response)
            })
            .catch(e => {
                console.log(e);
            });
        }, []);
    return (
            <>
             <form   onSubmit={handleSubmit}>
            <div className="card card-custom">
            <div className="card-header align-items-center py-5 gap-2 gap-md-5">
                <div className="card-title">
                    <div className="d-flex align-items-center position-relative my-1">
                        <h2>Editar cita</h2>
                    </div>
                </div>

                <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                    <Link to={"/cita"} 
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
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">correlativo</label>
                                         <input type="text" name="correlativo"  defaultValue={cita.correlativo} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-6  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Cliente</label>
                                    <Select required placeholder="Seleccione Cliente"
                                        name="_id"  
                                        options={cliente}
                                        onChange={(e) => handleChangeCliente(e)}
                                        getOptionValue={option => option._id}
                                        getOptionLabel={option => option.cliente}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Fecha</label>
                                    <input type="date" name="fecha_inicio"  defaultValue={cita.fecha_inicio} 
                                         className="form-control" onChange={handleChange}  />     
                                </div>
                            </div>
                             
                           
                            <div className="col-lg-12  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Descripcion</label>
                                         <input type="text" name="descripcion"  defaultValue={cita.descripcion} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Sucursal</label>
                                    <select className="form-control" required onChange={handleChange}
                                                    name="sucursalId" value={cita.sucursalId} >
                                                        <option value="">[Seleccione]</option>
                                                    <DDlSucursal empresaId={currentUser.empresa[0]._id} />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Doctor</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="personalId" value={cita.personalId}>
                                        <option value="">[Seleccione]</option>
                                        <DDlPersonal puesto="doctor" empresaId={currentUser.empresa[0]._id} />  
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
