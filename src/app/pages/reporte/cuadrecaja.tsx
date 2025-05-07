
import React, { Component, useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import ingresoDataService from "../../../_services/ingreso";
import pagoDataService from "../../../_services/pago";
import parametroDataService from "../../../_services/parametro";
import personalDataService from "../../../_services/personal";
import moment from "moment";
import { Proveedor } from "../../../_models/proveedor";
import { Reporte } from "../../../_models/reporte";
import { usePDF } from 'react-to-pdf';
import { Pago } from "../../../_models/pago";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, LabelList, Label, Text } from "recharts";
import { DDlProveedor } from "../../../_metronic/layout/components/select/proveedor";
import { Ingreso } from "../../../_models/ingreso";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import { useAuth } from "../../modules/auth";
import {    cellKeyboardShortcuts, MaterialReactTable,MRT_ActionMenuItem,MRT_AggregationFns,MRT_ColumnDef,useMaterialReactTable} from 'material-react-table';

export function CajaReportePage() {
    const { currentUser } = useAuth()

    const [reporte, setReporte] = useState<Reporte>({});
    const [pago, setPago] = useState([]);
    const [ingreso, setIngreso] = useState([]);
    const [metodo, setMetodo] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [personal, setPersonal] = useState([]);
    const [datagrafico, setGrafico] = useState([]);
    const componentRef = useRef();
    const columns_ingreso = [
        { accessorKey: 'metodo_pago', header: 'Metodo', },
        { accessorKey: 'total_importe', header: 'Total', },
    ]
    const columns_pago = [
        { accessorKey: 'tipo_pago', header: 'Tipo', },
        { accessorKey: 'categoria', header: 'Categoria',  },
        { accessorKey: 'total_importe', header: 'Total',   },
    ]
    const grupo = [];
    const handleChange = (e) => {
        //console.log(e);
        setReporte((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        //console.log(reporte)
    };
    const { toPDF, targetRef } = usePDF({
        filename: 'Reporte de Cuadre de Caja.pdf',
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
        reporte.empresaId= currentUser?.empresa[0]._id
        console.log(reporte)
        ingresoDataService.reportexdia(reporte)
            .then(function (response) {
                console.log(response.data)
                setIngreso(response.data)
            })
        pagoDataService.reportexdia(reporte)
            .then(function (response) {
                console.log(response.data)
                setPago(response.data)
            })
    }
    useEffect(() => {
        
        const fecha = new Date();
        reporte.fec_crea = moment().add(-7, 'd').format('yyyy-M-DD')
        reporte.fec_modi = moment().format('yyyy-M-DD')
        reporte.proveedorId = ""

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

                                    <div className="col-lg-3  input-group-sm mb-5">
                                        <div className="  mb-2">
                                            <label className="form-label" id="inputGroup-sizing-sm">Fecha del Dia:</label>
                                            <input type="date" name="fec_crea"  
                                                className="form-control" onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-lg-3  input-group-sm mb-5">
                                        <div className="  mb-2">
                                            <label className="form-label" id="inputGroup-sizing-sm">Cuenta</label>
                                            <select className="form-control" required onChange={handleChange}
                                                name="cuenta">
                                                <option value="">[Seleccione]</option>
                                                <DDlParametro dominio="cuenta" />
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-2  input-group-sm mb-5">
                                        <div className="  mb-2">
                                            <label className="form-label" id="inputGroup-sizing-sm">Moneda</label>
                                            <select className="form-control" required onChange={handleChange}
                                                name="moneda" >
                                                <option value="">[Seleccione]</option>
                                                <DDlParametro dominio="moneda" />
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div ref={targetRef}>
                <h1 className="anchor fw-bold mb-5" id="basic" data-kt-scroll-offset="50">
                    <a href="#basic"></a>Reporte Cuadre de Caja</h1>
                <div className="py-5">
                    Fecha: {reporte.fec_crea}<br></br>
                    Moneda:{reporte.moneda}<br></br>
                    Cuenta:{reporte.cuenta}
                </div>
                <div className="row">
                    <div className="col-lg-6">
                        <div data-kt-buttons="true">
                            <label className="btn btn-outline btn-outline-dashed btn-light-primary d-flex flex-stack text-start p-6 mb-5 border-primary  ">
                                <div className="d-flex align-items-center me-2">
                                    <div className="flex-grow-1">
                                        <h1 className="d-flex align-items-center fs-3 fw-bold flex-wrap">
                                            Total Ingresos
                                        </h1>
                                    </div>
                                </div>
                                <div className="ms-5">
                                    <span className="mb-2"></span>
                                    <span className="fs-3x fw-bold">
                                        {ingreso.reduce((acc, pilot) => acc + Number(pilot.total_importe), 0)}
                                    </span>
                                    <span className="fs-7 opacity-50">/
                                        <span data-kt-element="period"></span>
                                    </span>
                                </div>
                            </label>

                        </div>

                    </div>
                    <div className="col-lg-3">
                        <div data-kt-buttons="true">
                            <label className="btn btn-outline btn-outline-dashed btn-light-danger d-flex flex-stack text-start p-6 mb-5  border-danger">
                                <div className="d-flex align-items-center me-2">
                                    
                                    <div className="flex-grow-1">
                                        <h1 className="d-flex align-items-center fs-3 fw-bold flex-wrap">
                                            Total Pagos
                                        </h1>
                                    </div>
                                </div>
                                <div className="ms-5">
                                    <span className="mb-2"></span>
                                    <span className="fs-3x fw-bold">
                                        {pago.reduce((acc, pilot) => acc + Number(pilot.total_importe), 0)}
                                    </span>
                                    <span className="fs-7 opacity-50">/
                                        <span data-kt-element="period"></span>
                                    </span>
                                </div>
                            </label>

                        </div>

                    </div><div className="col-lg-3">
                        <div data-kt-buttons="true">
                            <label className="btn btn-outline btn-outline-dashed btn-light-success d-flex flex-stack text-start p-6 mb-5 border-success ">
                                <div className="d-flex align-items-center me-2">
                                   
                                    <div className="flex-grow-1">
                                        <h1 className="d-flex align-items-center fs-3 fw-bold flex-wrap">
                                            Saldo
                                        </h1>
                                    </div>
                                </div>
                                <div className="ms-5">
                                    <span className="mb-2"></span>
                                    <span className="fs-3x fw-bold">
                                        {Number(ingreso.reduce((acc, pilot) => acc + Number(pilot.total_importe), 0))-
                                        pago.reduce((acc, pilot) => acc + Number(pilot.total_importe), 0)
                                        }
                                        
                                    </span>
                                    <span className="fs-7 opacity-50">/
                                        <span data-kt-element="period"></span>
                                    </span>
                                </div>
                            </label>

                        </div>

                    </div>
                    <div className="col-lg-6">
                        <MaterialReactTable columns={columns_ingreso} data={ingreso}
                            enableTopToolbar={ false}
                            initialState={{
                                density: 'compact',
                            }}
                        />
                    </div>
                    <div className="col-lg-6">
                        <MaterialReactTable columns={columns_pago} data={pago}
                            enableTopToolbar={ false}
                            initialState={{
                                density: 'compact',
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
} 