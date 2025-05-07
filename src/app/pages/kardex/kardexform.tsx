
import React, { useEffect,useState} from "react";
import { Link ,useNavigate} from "react-router-dom";
import kardexDataService from "../../../_services/kardex";
import parametroDataService from "../../../_services/parametro";
import productoDataService from "../../../_services/producto";

import { useAuth } from "../../modules/auth";
import { Kardex } from "../../../_models/kardex";
import Select from 'react-select';
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import moment from "moment";
import { DDLAlmacen } from "../../../_metronic/layout/components/select/almacen";
import { DDlSucursal } from "../../../_metronic/layout/components/select/sucursal";



export default function KardexForm()  {
  const { currentUser } = useAuth()
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search)
  const tipomov = queryParameters.get("tipo")
  const [kardexx, setkardex] = useState<Kardex>({});
  const [almacen, setAlmacen] = useState([]);
  const [producto, setProducto] = useState([]);
  const handleSubmit = async (e ) => {
            e.preventDefault();
            const answer = window.confirm("Esta seguro de Guardar el Registro?");
            if (answer) {
              console.log(kardexx);
                kardexx.usu_crea = currentUser?.codigo
                kardexx.codigo_estado = '1'
                kardexx.tipo_mov=tipomov
                kardexx.empresaId= currentUser?.empresa[0]._id
                kardexDataService.createkardex(kardexx)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Insertado correctamente");
                      navigate('/kardex');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
              
            }
    };
    const handleChangeProducto = (e) => {
        //console.log(e.target.value)
        //console.log(e.target.label)
        setkardex((prev) => ({
            ...prev,
            ["productoId"]: e._id,
            ["producto"]:e.producto
        }));
    };
    const handleChange = (e ) => {
        //console.log(e);
        //console.log(e.target);
        if (typeof e.target === 'undefined'){
            console.log('select')
            setkardex((prev) => ({
                ...prev,
                "producto": e.producto,
                "codigo":e.codigo
            }));
        }else {
            console.log('todo')
            setkardex((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
            }));
        }
      console.log(kardexx)
    };
    useEffect(() => {
        const fecha = new Date();
        kardexx.fecha = moment().format('yyyy-M-DD')
        parametroDataService.getparametroByCod('almacen')
            .then(function (response) {
                setAlmacen(response.data);
                //console.log(result);
        })
        productoDataService.getproducto(currentUser.empresa[0]._id)
            .then(response => response.json())
            .then(result => {
                setProducto(result);
                //console.log(result);
        })        
        }, []);
    return (
            <>
             <form   onSubmit={handleSubmit}>
            <div className="card card-custom">
                
                
                <div                 
                className={tipomov=="0" ? 'card-header bg-light-danger' : 'card-header bg-light-primary'}>
                <div className="card-title">
                    <div className="d-flex align-items-center position-relative my-1">
                        <h2>{tipomov=="0" ? 'Registrar Salida  de Almacén':'Registrar Ingreso al Almacén'}</h2>
                    </div>
                </div>

                <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                    <Link to={"/kardex"} 
                            className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                            <i className="fa-solid fa-reply "></i>
                            Volver
                            </Link>
                            <button className='btn btn-primary btn-sm' type="submit">
                            <i className="fa-solid fa-floppy-disk"></i>
                            Guardar</button>
                            
                </div>
            </div>
            
            <div className="card-body pt-10">
                <div className="form-group row">
                            <div className="col-lg-6  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Producto</label>
                                    <Select required placeholder="Seleccione Producto"
                                        name="_id"
                                        options={producto}
                                        onChange={(e)=> {handleChangeProducto(e)}}
                                        getOptionValue={option => option.codigo}
                                        getOptionLabel={option => option.producto+'-'+option.descripcion}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Fecha</label>
                                         <input type="date" name="fecha" required defaultValue={kardexx.fecha} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Sucursal</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="sucursalId">
                                        <option value="">[Seleccione]</option>
                                        <DDlSucursal empresaId={currentUser.empresa[0]._id} />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Almacen</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="almacenId">
                                        <option value="">[Seleccione]</option>
                                        <DDLAlmacen empresaId={currentUser.empresa[0]._id} />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Cantidad</label>
                                         <input type="number" name="cantidad" placeholder="0" required defaultValue={kardexx.cantidad} 
                                         className="form-control text-end" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Motivo</label>
                                         <select className="form-control" required onChange={handleChange} 
                                            name="motivo">
                                            <option value="">[Seleccione]</option>
                                            {tipomov=="0"?
                                            <>
                                                <option value='04'>CONSIGNACIÓN ENTREGADA</option>
                                                <option value='06'>DEVOLUCIÓN ENTREGADA</option>
                                                <option value='07'>PROMOCIÓN</option>
                                                <option value='08'>PREMIO</option>
                                                <option value='09'>DONACIÓN</option>
                                                <option value='10'>SALIDA A PRODUCCIÓN</option>
                                                <option value='12'>RETIRO</option>
                                                <option value='14'>DESMEDROS</option>
                                                <option value='15'>DESTRUCCIÓN</option>
                                                <option value='99'>OTROS (ESPECIFICAR)</option>

                                            </>:
                                            <>
                                            <option value='03'>CONSIGNACIÓN RECIBIDA</option>
                                            <option value='05'>DEVOLUCIÓN RECIBIDA</option>
                                            <option value='11'>TRANSFERENCIA ENTRE ALMACENES</option>
                                            <option value='16'>SALDO INICIAL</option>
                                            </>}
                                            
                                        </select>
                                </div>
                            </div>
                           
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Tipo Ubicación</label>
                                    <select className="form-control" onChange={handleChange} 
                                            name="tipo_ubicacion">
                                           <option value="">[Seleccione]</option>
                                           <DDlParametro dominio="tipo_ubicacion" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Ubicación</label>
                                         <input type="text" name="ubicacion"  defaultValue={kardexx.ubicacion} 
                                         className="form-control " onChange={handleChange}  />
                                </div>
                            </div>
                </div>
            </div>
        </div>
        </form>
        </>
        );
    }
