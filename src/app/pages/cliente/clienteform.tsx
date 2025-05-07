
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clienteDataService from "../../../_services/cliente";
import parametroDataService from "../../../_services/parametro";
import { useAuth } from "../../modules/auth";
import { Cliente } from "../../../_models/cliente";
import Select from 'react-select';
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import DDLUbigeo from "../../../_metronic/layout/components/select/ubigeo";
 



export default function ClienteForm() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const idcliente = queryParameters.get("id")
    const [cliente, setcliente] = useState<Cliente>({});
    const [tipodoc, setTipoDoc] = useState([]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar el Registro?");
        if (answer) {
            console.log(cliente);
            if (idcliente == null) {
                cliente.usu_crea = currentUser?.codigo
                cliente.codigo_estado = '1'
                cliente.empresaId = currentUser?.empresa[0]._id
                clienteDataService.createcliente(cliente)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Insertado correctamente");
                        navigate('/cliente');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                cliente.usu_modi = currentUser?.codigo
                cliente._id = idcliente
                clienteDataService.updatecliente(idcliente, cliente)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Actualizado correctamente");
                        navigate('/cliente');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        }
    };
    const handleChange = (e) => {
        console.log();
        setcliente((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    
    const handleUbigeoChange = (ubigeo) => {
        setcliente(prev => ({ ...prev, ubigeo }));
    };
    useEffect(() => {
        if (idcliente !== null) {
            clienteDataService.getclienteById(idcliente)
                .then(response => response.json())
                .then(result => {
                    setcliente(result);
                    console.log(result);
                })
                .catch(e => {
                    console.log(e);
                });
        }
        parametroDataService.getparametroByCod('tipo_doc')
            .then(function (response) {
                setTipoDoc(response.data);
                //console.log(result);
            })
    }, []);
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-light-primary">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-dark">Registro de cliente</h3>
                        <span className="text-dark">Detalle
                        </span>
                    </div>
                    <div className="d-flex   flex-row-fluid justify-content-end">

                        <Link to={"/cliente"}
                            className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                            <i className="fa-solid fa-reply "></i>
                            Volver
                        </Link>
                        <button className='btn btn-primary btn-sm' type="submit">
                            <i className="fa-solid fa-floppy-disk"></i>
                            Guardar</button>
                    </div>
                </div>
                <div className="card card-custom">

                    <div className="card-body pt-10">
                        <div className="form-group row">
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Tipo Documento</label>
                                    <select className="form-control" onChange={handleChange}
                                        name="tipo_doc" value={cliente.tipo_doc}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="tipo_doc" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Número Documento</label>
                                    <input type="text" name="nro_doc" required defaultValue={cliente.nro_doc}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-6  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Cliente</label>
                                    <input type="text" name="cliente" placeholder="Nombres y Apellidos" required defaultValue={cliente.cliente}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>

                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Teléfono</label>
                                    <input type="text" name="telefono" required defaultValue={cliente.telefono}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Email</label>
                                    <input type="email" name="email" required defaultValue={cliente.email}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>

                            <div className="col-lg-12  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Dirección</label>
                                    <input type="text" name="direccion" defaultValue={cliente.direccion}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <DDLUbigeo onUbigeoChange={handleUbigeoChange}></DDLUbigeo>
 
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
