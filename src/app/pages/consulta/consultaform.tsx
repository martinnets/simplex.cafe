
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import consultaDataService from "../../../_services/consulta";
import clienteDataService from "../../../_services/cliente";
import { useAuth } from "../../modules/auth";
import { Consulta } from "../../../_models/consulta";
import { DDlCliente } from "../../../_metronic/layout/components/select/cliente";
import { Cliente } from "../../../_models/cliente";
import Select from 'react-select';


export default function ConsultaForm() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const idconsulta = queryParameters.get("id")
    const [consulta, setconsulta] = useState<Consulta>({});
    const [cliente, setcliente] = useState([]);
    const [elementosel, setElementoSel] = useState<Cliente>({});
    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar el Registro?");
        if (answer) {
            console.log(consulta);
            if (idconsulta == null) {
                consulta.usu_crea = currentUser?.codigo
                consulta.codigo_estado = '1'
                consulta.empresaId= currentUser?.empresa[0]._id
                consultaDataService.createconsulta(consulta)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Insertado correctamente");
                        navigate('/consulta');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                consulta.usu_modi = currentUser?.codigo
                consulta._id = idconsulta
                consultaDataService.updateconsulta(idconsulta,consulta)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Actualizado correctamente");
                        navigate('/consulta');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        }
    };
    const handleChange = (e) => {
        console.log();
        setconsulta((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    const handleChangeCliente = (e) => {
        setElementoSel(e)
        console.log(e)

        setconsulta((prev) => ({
            ...prev,
            ["clienteId"]: e._id,
        }));
    };
    useEffect(() => {
        if (idconsulta !== null) {
            consultaDataService.getconsultaById(idconsulta)
                .then(response => response.json())
                .then(result => {
                    setconsulta(result);
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
            <form onSubmit={handleSubmit}>
                <div className="card card-custom">
                    <div className="card-header align-items-center py-5 gap-2 gap-md-5">
                        <div className="card-title">
                            <div className="d-flex align-items-center position-relative my-1">
                                <h2>Editar consulta</h2>
                            </div>
                        </div>

                        <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                            <Link to={"/consulta"}
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
                        <div className="row">
                            <div className="col-lg-4  input-group-sm mb-5">
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
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label"  >Telefono</label>
                                    <span className="form-control" >{elementosel.telefono}</span>
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label"  >Email</label>
                                    <span className="form-control" >{elementosel.email}</span>
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label"  >Documento</label>
                                    <span className="form-control" >{elementosel.nro_doc}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-light-primary">
                    <div className="d-flex flex-column">
                        <h3 className="mb-1 text-dark">Detalle de la Consulta</h3>
                        <span className="text-dark">Modifique los valores
                        </span>
                    </div>

                </div>
                <div className="card card-custom">

                    <div className="card-body pt-10">
                        <div className="row">
                        <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Fecha</label>
                                    <input type="date" name="fecha" required defaultValue={consulta.fecha}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Rando OD</label>
                                    <input type="text" name="rango_od" 
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Rango OI</label>
                                    <input type="text" name="rango_oi"
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">ADD Cerca</label>
                                    <input type="text" name="add_cerca" 
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <table className="table">
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td className="text-center bg-light-danger">Esfera</td>
                                    <td className="text-center bg-light-danger">Cilindro</td>
                                    <td className="text-center bg-light-danger">Eje</td>
                                    <td className="text-center bg-light-danger">Prisma</td>
                                    <td className="text-center bg-light-danger">AV</td>
                                    <td className="text-center bg-light-danger">DIP</td>
                                </tr>
                                <tr>
                                    <td><span className="text-dark">LEJOS</span> </td>
                                    <td>
                                        <span className="btn btn-icon"><i className="fa-solid fa-eye text-primary"></i>OD </span>
                                    </td>
                                    <td> <input type="text" name="lod_esfera" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="text" name="lod_cilindro" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="number" name="lod_eje" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="text" name="lod_prisma" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="text" name="lod_av" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="number" name="lod_dip" className="form-control text-end" onChange={handleChange} /></td>
                                </tr>
                                <tr>
                                    <td> </td>
                                    <td>
                                        <span className="btn btn-icon"><i className="fa-solid fa-eye text-success"></i>OI </span>
                                    </td>
                                    <td> <input type="text" name="loi_esfera" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="text" name="loi_cilindro" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="number" name="loi_eje" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="text" name="loi_prisma" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="text" name="loi_av" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="number" name="loi_dip" className="form-control text-end" onChange={handleChange} /></td>
                                </tr>
                                <tr>
                                    <td>CERCA </td>
                                    <td>
                                        <span className="btn btn-icon"><i className="fa-solid fa-eye text-primary"></i>OD </span>
                                    </td>
                                    <td> <input type="text" name="cod_esfera" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="text" name="cod_cilindro" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="number" name="cod_eje" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="text" name="cod_prisma" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="text" name="cod_av" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="number" name="cod_dip" className="form-control text-end" onChange={handleChange} /></td>
                                </tr>
                                <tr>
                                    <td> </td>
                                    <td>
                                        <span className="btn btn-icon">
                                            <i className="fa-solid fa-eye text-success"></i>OI </span>
                                    </td>
                                    <td> <input type="text" name="coi_esfera" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="text" name="coi_cilindro" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="number" name="coi_eje" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="text" name="coi_prisma" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="text" name="coi_av" className="form-control text-end" onChange={handleChange} /></td>
                                    <td> <input type="number" name="coi_dip" className="form-control text-end" onChange={handleChange} /></td>
                                </tr>
                            </table>
                            <div className="col-lg-12  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Observacion</label>
                                    <input type="text" name="observacion" 
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
