/* eslint-disable react-hooks/rules-of-hooks */

import React, { useCallback, Component, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import productoDataService from "../../../_services/producto";
import { useAuth } from "../../modules/auth";
import { Producto } from "../../../_models/producto";
import * as XLSX from 'xlsx';



export default function ProductoImportar() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const idproducto = queryParameters.get("id")
    const [producto, setproducto] = useState([]);
    const [importar, setImportar] = useState([]);
    const [fileData, setFileData] = useState(null);
    const [tableData, setTableData] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Importar los Productos?");
        if (answer) {
            //console.log(producto);
            // tableData.forEach((elemento) => 
            //     {
            //         console.log(JSON.stringify(elemento))

            //     }
            // );
            
            productoDataService.createproducto(tableData)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registros Importados correctamente");
                      navigate('/producto');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
        }
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
        const workbook = XLSX.read(event.target.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData = XLSX.utils.sheet_to_json(sheet);
        console.log(sheetData)
        setTableData(sheetData);
    };

    reader.readAsBinaryString(file);
        
    }
    useEffect(() => {
        if (idproducto !== null) {
            productoDataService.getproductoById(idproducto)
                .then(response => response.json())
                .then(result => {
                    setproducto(result);
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
                    <div className="card-header align-items-center py-5 gap-2 gap-md-5">
                        <div className="card-title">
                            <div className="d-flex align-items-center position-relative my-1">
                                <h2>Importar Productos</h2>
                            </div>
                        </div>

                        <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                            <Link to={"/producto"}
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
                        <form>
                            <label>
                                Cargar archivo xlsx:
                                <input type="file" onChange={handleFileChange} />
                            </label>
                        </form>
                        {tableData && (
                            <div>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <td style={{ fontSize: '10px', color: '#fff', backgroundColor: '#009ef7' }}>Codigo</td>
                                            <td style={{ fontSize: '10px', color: '#fff', backgroundColor: '#009ef7' }}>Producto</td>
                                            <td style={{ fontSize: '10px', color: '#fff', backgroundColor: '#009ef7' }}>Categoría</td>
                                            <td style={{ fontSize: '10px', color: '#fff', backgroundColor: '#009ef7' }}>Sub Categoría</td>
                                            <td style={{ fontSize: '10px', color: '#fff', backgroundColor: '#009ef7' }}>Marca</td>
                                            <td style={{ fontSize: '10px', color: '#fff', backgroundColor: '#009ef7' }}>Material</td>
                                            <td style={{ fontSize: '10px', color: '#fff', backgroundColor: '#009ef7' }}>Modelo</td>
                                            <td style={{ fontSize: '10px', color: '#fff', backgroundColor: '#009ef7' }}>Color</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableData.map((usuario, index) => (
                                            <tr key={index}>
                                                <td>{usuario.codigo}</td>
                                                <td>{usuario.producto}</td>
                                                <td>{usuario.categoria}</td>
                                                <td>{usuario.subcategoria}</td>
                                                <td>{usuario.marca}</td>
                                                <td>{usuario.material}</td>
                                                <td>{usuario.modelo}</td>
                                                <td>{usuario.color}</td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>

                            </div>
                        )}
                    </div>
                </div>
            </form>
        </>
    );
}
