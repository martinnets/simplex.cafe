
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gastoDataService from "../../../_services/gasto";
import { useAuth } from "../../modules/auth";
import { Gasto } from "../../../_models/gasto";



export default function GastoForm() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const idgasto = queryParameters.get("id")
    const [gasto, setgasto] = useState<Gasto>({});
    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar el Registro?");
        if (answer) {
            console.log(gasto);
            if (idgasto == null) {
                gasto.usu_crea = currentUser?.codigo
                gasto.codigo_estado = '1'
                gastoDataService.creategasto(gasto)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Insertado correctamente");
                        navigate('/gasto');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                gasto.usu_modi = currentUser?.codigo
                gasto._id = idgasto
                gastoDataService.updategasto(gasto)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Actualizado correctamente");
                        navigate('/gasto');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        }
    };
    const handleChange = (e) => {
        console.log();
        setgasto((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    useEffect(() => {
        if (idgasto !== null) {
            gastoDataService.getgastoById(idgasto)
                .then(response => response.json())
                .then(result => {
                    setgasto(result);
                    console.log(result);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }, []);
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="card card-custom">
                    <div className="card-header align-items-center py-5 gap-2 gap-md-5 bg-light-primary">
                        <div className="card-title">
                            <div className="d-flex align-items-center position-relative my-1">
                                <h2>Registro de Gasto</h2>
                            </div>
                        </div>

                        <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                            <Link to={"/gasto"}
                                className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                                <i className="fa-solid fa-reply "></i>
                                Volver
                            </Link>
                            <button className='btn btn-primary btn-sm' type="submit">
                                <i className="fa-solid fa-floppy-disk"></i>
                                Guardar</button>

                        </div>
                    </div>
                    
                    <div className="card-body ">
                        <span>Cagegoria:</span>
                                <div className="row" >
                                    <div className="col">
                                        <label className="btn btn-outline btn-outline-dashed btn-active-light-primary d-flex flex-stack text-start p-6 mb-5">
                                            <div className="d-flex flex_row align-items-center me-2">
                                                <div className="form-check form-check-custom form-check-solid form-check-primary me-2">
                                                    <input className="form-check-input  " type="radio" required name="grupo" value="alquiler" onChange={handleChange} />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <i className="fa-solid fa-house-flag fs-2x  "></i> 
                                                    <div className="fw-semibold opacity-50">
                                                        Alquiler
                                                    </div>                                             
                                                </div>
                                            </div>                                        
                                        </label>
                                    </div>
                                    <div className="col">
                                        <label className="btn btn-outline btn-outline btn-active-light-primary d-flex flex-stack text-start p-6">
                                            <div className="d-flex flex_row align-items-center me-2">
                                                <div className="form-check form-check-custom form-check-solid form-check-primary me-2">
                                                    <input className="form-check-input" type="radio" required name="grupo" value="personal" onChange={handleChange} />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <i className="fa-solid fa-user-tie fs-2x  "></i>   
                                                    <div className="fw-semibold opacity-50">
                                                        Personal
                                                    </div>                                             
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <label className="btn btn-outline btn-outline btn-active-light-primary d-flex flex-stack text-start p-6">
                                            <div className="d-flex flex_row align-items-center me-2">
                                                <div className="form-check form-check-custom form-check-solid form-check-primary me-6">
                                                    <input className="form-check-input" type="radio" name="grupo" value="alimentos" onChange={handleChange} />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <i className="fa-solid fa-utensils fs-2x  "></i>   
                                                    <div className="fw-semibold opacity-50">
                                                        Biselados
                                                    </div>                                             
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <label className="btn btn-outline btn-outline btn-active-light-primary d-flex flex-stack text-start p-6">
                                            <div className="d-flex flex_row align-items-center me-2">
                                                <div className="form-check form-check-custom form-check-solid form-check-primary me-2">
                                                    <input className="form-check-input" type="radio" name="grupo" value="movilidad" onChange={handleChange} />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <i className="fa-solid fa-taxi fs-2x  "></i>   
                                                    <div className="fw-semibold opacity-50">
                                                        Monturas                                                        
                                                    </div>                                             
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="col">
                                        <label className="btn btn-outline btn-outline btn-active-light-primary d-flex flex-stack text-start p-6">
                                            <div className="d-flex flex_row align-items-center me-2">
                                                <div className="form-check form-check-custom form-check-solid form-check-primary me-2">
                                                    <input className="form-check-input" type="radio" name="grupo" value="movilidad" onChange={handleChange} />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <i className="fa-solid fa-bullhorn fs-2x  "></i>   
                                                    <div className="fw-semibold opacity-50">
                                                        Lunas
                                                    </div>                                             
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    <div className="col">
                                        <label className="btn btn-outline btn-outline btn-active-light-primary d-flex flex-stack text-start p-6">
                                            <div className="d-flex flex_row align-items-center me-2">
                                                <div className="form-check form-check-custom form-check-solid form-check-primary me-2">
                                                    <input className="form-check-input" type="radio" name="grupo" value="movilidad" onChange={handleChange} />
                                                </div>
                                                <div className="flex-grow-1">
                                                    <i className="fa-solid fa-asterisk fs-2x  "></i>   
                                                    <div className="fw-semibold opacity-50">
                                                        Consultas
                                                    </div>                                             
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                
                                </div>
                        <div className="form-group row">
                            <div className="col-lg-12  input-group-sm mb-5">
                               

                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Nro Recibo</label>
                                    <input type="text" name="codigo" defaultValue={gasto.codigo}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Fecha</label>
                                    <input type="date" name="fecha" required defaultValue={gasto.fecha}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Forma de Pago</label>
                                    <select className="form-control"  required onChange={handleChange}
                                        name="forma_pago">
                                        <option value="">[Seleccione]</option>
                                        <option value="efectivo">Efectivo</option>
                                        <option value="transferencia">Transferencia</option>
                                        <option value="tc">TC</option>
                                        <option value="td">TD</option>
                                        <option value="yape">Yape</option>
                                        <option value="plin">Plin</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Tipo de Gasto</label>
                                    <select className="form-control" onChange={handleChange}
                                        name="tipo_gasto">
                                        <option value="">[Seleccione]</option>
                                        <option value="administrativo">Administrativo</option>
                                        <option value="operativo">Operativo</option>
                                        <option value="otro">OTro</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-6  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Concepto</label>
                                    <input type="text" name="concepto" required defaultValue={gasto.concepto}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Importe</label>
                                    <input type="number"  name="importe" required defaultValue={gasto.importe}
                                        className="form-control text-end" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Moneda</label>
                                    <select className="form-control" required onChange={handleChange}
                                        name="moneda">
                                        <option value="">[Seleccione]</option>
                                        <option value="PEN">PEN</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-6  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Proveedor</label>
                                    <input type="text" name="proveedor" defaultValue={gasto.proveedor}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-6  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Observacion</label>
                                    <input type="text" name="observacion" defaultValue={gasto.observacion}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
