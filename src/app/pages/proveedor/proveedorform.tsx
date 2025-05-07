
import React, { useEffect,useState} from "react";
import { Link ,useNavigate} from "react-router-dom";
import proveedorDataService from "../../../_services/proveedor";
import { useAuth } from "../../modules/auth";
import { Proveedor } from "../../../_models/proveedor";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import DDLUbigeo from "../../../_metronic/layout/components/select/ubigeo";



export default function ProveedorForm()  {
  const { currentUser } = useAuth()
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search)
  const idproveedor = queryParameters.get("id")
  const [proveedor, setproveedor] = useState<Proveedor>({});
  const handleSubmit = async (e ) => {
            e.preventDefault();
            const answer = window.confirm("Esta seguro de Guardar el Registro?");
            if (answer) {
              console.log(proveedor);
              if (idproveedor  == null){
                proveedor.usu_crea = currentUser?.codigo
                proveedor.codigo_estado = '1'
                proveedor.empresaId= currentUser?.empresa[0]._id
                proveedorDataService.createproveedor(proveedor)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Insertado correctamente");
                      navigate('/proveedor');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
              } else {
                proveedor.usu_modi = currentUser?.codigo
                proveedor._id=idproveedor
                proveedorDataService.updateproveedor(idproveedor,proveedor)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Actualizado correctamente");
                      navigate('/proveedor');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
               
              }
            }
    };
    const handleChange = (e ) => {
        console.log();
        setproveedor((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const handleUbigeoChange = (ubigeo) => {
        setproveedor(prev => ({ ...prev, ubigeo }));
    };
    useEffect(() => {
        if (idproveedor  !== null){
             proveedorDataService.getproveedorById(idproveedor)
                .then(response => response.json())
                .then(result => {
                    setproveedor(result);
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
                        <h2>Editar proveedor</h2>
                    </div>
                </div>

                <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                    <Link to={"/proveedor"} 
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
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Tipo Documento</label>
                                         <select className="form-control" onChange={handleChange} 
                                            name="tipo_doc">
                                           <option value="">[Seleccione]</option>
                                            <DDlParametro dominio="tipo_doc" />
                                        </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Número Documento</label>
                                    <input type="text" name="nro_doc"  defaultValue={proveedor.nro_doc} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-6  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Razón Social</label>
                                         <input type="text" name="proveedor"  defaultValue={proveedor.proveedor} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-12  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Dirección</label>
                                         <input type="text" name="direccion"  defaultValue={proveedor.direccion} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <DDLUbigeo onUbigeoChange={handleUbigeoChange}></DDLUbigeo>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">telefono</label>
                                         <input type="text" name="telefono"  defaultValue={proveedor.telefono} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">email</label>
                                         <input type="text" name="email"  defaultValue={proveedor.email} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">web</label>
                                         <input type="text" name="web"  defaultValue={proveedor.web} 
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
