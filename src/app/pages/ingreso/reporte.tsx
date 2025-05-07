
import React, { Component, useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import ingresoDataService from "../../../_services/ingreso";
import clienteDataService from "../../../_services/cliente";
import personalDataService from "../../../_services/personal";
import moment from "moment";
import { Cliente } from "../../../_models/cliente";
import { Reporte } from "../../../_models/reporte";
import { usePDF } from 'react-to-pdf';
import { Ingreso } from "../../../_models/ingreso";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, LabelList, Label, Text } from "recharts";
import { offset, right } from "@popperjs/core";
import { useAuth } from "../../modules/auth";
import { report } from "process";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import {    cellKeyboardShortcuts, MaterialReactTable,MRT_AggregationFns,MRT_ColumnDef,useMaterialReactTable} from 'material-react-table';
import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";
export function IngresoReportePage() {
    const { currentUser } = useAuth()
    const [reporte, setReporte] = useState<Reporte>({});
    const [ingreso, setIngreso] = useState([]);
    const [cliente, setCliente] = useState([]);
    const [clientedesc, setClienteDesc] = useState(null);
    const [personal, setPersonal] = useState([]);
    const [datagrafico, setGrafico] = useState([]);
    const componentRef = useRef();
    const grupo = [];
    const handleChange = (e) => {
        //console.log(e);
        setReporte((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        if (e.target.name==='clienteId'){
            // console.log(e.target.name)
            // console.log(e.target.value)
            // console.log(e.target.options[e.target.selectedIndex].text)
            if( e.target.value===''){
                setClienteDesc('Todos')
            }else{
                setClienteDesc(e.target.options[e.target.selectedIndex].text)
            }
        }
        //console.log(reporte)
    };
    const { toPDF, targetRef } = usePDF({
        filename: 'Reporte de Ingresos.pdf',
        page: {
            margin: 5,
            format: "A4",
            orientation: "landscape",
        },
        overrides: {
            pdf: { compress: true, },
            canvas: { useCORS: true, },
        },
    });

    const handleReporte = async (e) => {
        e.preventDefault();
        //reporte.fec_crea=reporte.fec_crea+'T00:00:00.000Z'
        //reporte.fec_modi=reporte.fec_modi+'T23:59:59.999Z'
        //console.log(reporte)
        reporte.empresaId = currentUser?.empresa[0]._id
        console.log(reporte)
        ingresoDataService.reporteingreso(reporte)
            .then(function (response) {
                console.log(response.data);
                setIngreso(response.data)
            })
            .catch(e => {
                console.log(e);
            });
        // ingresoDataService.reporteingresopago(reporte)
        //     .then(function (response) {
        //         console.log(response.data);
        //         setGrafico(response.data)
        //     })
        //     .catch(e => {
        //         console.log(e);
        //     });
    }
    
    const columns =
    [
        { id: 'moneda',header: 'Moneda',accessorKey: 'moneda',size:10},
        { id: 'categoria', header: 'Categoria',accessorKey: 'categoria',},
        { id: 'fecha',header: 'Fecha',accessorKey: 'fecha',size:40},
        { id: 'concepto',header: 'concepto',accessorKey: 'concepto',size:100},
        { id: 'clientedesc',header: 'Cliente',accessorKey: 'clientedesc',},
        { id: 'importe',header: 'importe',accessorKey: 'importe',        },
    ]
    useEffect(() => {
        const fecha = new Date();
        //console.log(fecha)
        reporte.fec_crea = moment().add(-7, 'd').format('yyyy-M-DD')
        reporte.fec_modi = moment().format('yyyy-M-DD')
        reporte.clienteId = ""
        //console.log(reporte)
        clienteDataService.getcliente(currentUser?.empresa[0]._id)
            .then(response => response.json())
            .then(response => {
                //setCliente(response)
                //console.log(response)
                setCliente(response);
            })
        personalDataService.getpersonal(currentUser?.empresa[0]._id)
            .then(response => response.json())
            .then(response => {
                setPersonal(response);
            })

    }, []);
    return (
        <>
            <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
                <div className='row'>
                    <div className="col-lg-12">
                        <div className="alert alert-secondary d-flex align-items-center p-5 bg-dark">
                            <div className="d-flex flex-column">
                                <h3 className="mb-1 text-light">Reporte de Ingresos</h3>
                                <span className="text-light">Detalle
                                </span>
                            </div>
                            <div className="d-flex   flex-row-fluid justify-content-end">
                                <button onClick={handleReporte} className='btn btn-secondary btn-sm' >
                                    <i className="fa-solid fa-floppy-disk"></i>
                                    Generar Reporte</button>
                                <button className='btn  btn-danger  btn-sm '
                                    onClick={() => toPDF()}>
                                    <i className="fa-solid fa-file-pdf fs-1x text-light"></i>
                                    Genera     PDF</button>
                            </div>
                        </div>
                        <div className="card ">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-lg-2  input-group-sm mb-5">
                                        <div className="  mb-2">
                                            <label className="form-label" id="inputGroup-sizing-sm">Fecha desde:</label>
                                            <input type="date" name="fec_crea" defaultValue={reporte.fec_crea}
                                                className="form-control" onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-lg-2  input-group-sm mb-5">
                                        <div className="  mb-2">
                                            <label className="form-label" id="inputGroup-sizing-sm">Hasta</label>
                                            <input type="date" name="fec_modi" defaultValue={reporte.fec_modi}
                                                className="form-control" onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-lg-2  input-group-sm mb-5">
                                        <div className="  mb-2">
                                            <label className="form-label" id="inputGroup-sizing-sm">Cliente</label>
                                            <select className="form-control" required 
                                            onChange={handleChange}
                                                name="clienteId">
                                                <option value="">[Todos]</option>
                                                {cliente.map(item => <><option value={item._id}>{item.cliente}</option></>)}

                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-2  input-group-sm mb-5">
                                        <div className="  mb-2">
                                            <label className="form-label" id="inputGroup-sizing-sm">Cuenta</label>
                                            <select className="form-control" required onChange={handleChange}
                                                name="cuenta">
                                                <option value="">[Seleccione]</option>
                                                <DDlParametro dominio="cuenta" />
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-lg-4  ">
                                        <div className=" btn-group pt-5">
                                            <label className="form-label" id="inputGroup-sizing-sm">  </label>



                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {ingreso.length > 0 ?
                <>
                    <div ref={targetRef}>
                        <h1 className="anchor fw-bold mb-5" id="basic" data-kt-scroll-offset="50">
                            <a href="#basic"></a>Reporte de Ingresos</h1>
                            <div className="fw-semibold  text-gray-600">
                                <div className="fs-5">
                                Fecha:  {reporte.fec_crea}  al  {reporte.fec_modi} 
                                </div>
                                <div className="fs-5">
                                Cliente:  {clientedesc}  
                                </div>
                                <div className="fs-5">
                                Cuenta:  {reporte.cuenta} 
                                </div>

                        </div>
                        <div className="row">

                            <div className="col-lg-12">
                                <div className="table-responsive">
                                <MaterialReactTable columns={columns} data={ingreso}
                                enableKeyboardShortcuts={ false}
                                enableColumnActions={ false}
                                enableColumnFilters={ false}
                                enableGrouping= {true}
                                enableTopToolbar={ false}
                                initialState={{
                                    grouping:['moneda'],                                    
                                    density: 'compact',
                                    expanded: true, //expand all groups by default
                                  }}
                                  />
                                </div>
                            </div>
                           

                        </div>
                    </div>
                </> : <></>}

        </>
    );
} 


