
import React, { Component, useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import pagoDataService from "../../../_services/pago";
import proveedorDataService from "../../../_services/proveedor";
import personalDataService from "../../../_services/personal";
import moment from "moment";
import { Proveedor } from "../../../_models/proveedor";
import { Reporte } from "../../../_models/reporte";
import { usePDF } from 'react-to-pdf';
import { Pago } from "../../../_models/pago";
import {  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, LabelList,Label,Text} from "recharts";
import { DDlProveedor } from "../../../_metronic/layout/components/select/proveedor";
import { useAuth } from "../../modules/auth";
import {    cellKeyboardShortcuts, MaterialReactTable,MRT_AggregationFns,MRT_ColumnDef,useMaterialReactTable} from 'material-react-table';
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";

export function PagoReportePage() {
    const { currentUser } = useAuth()
    const [reporte, setReporte] = useState<Reporte>({});
    const [pago, setPago] = useState([]);
    const [metodo, setMetodo] = useState([]);
    const [categoria, setCategoria] = useState([]);
    const [proveedor, setProveedor] = useState([]);
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
        //console.log(reporte)
    };
    const { toPDF, targetRef } = usePDF({
        filename: 'Reporte de Pago.pdf',
        page: {
            margin: 5,
            format: "A4",
            orientation: "landscape",
        },
        overrides: {
            pdf: {                compress: true,            },
            canvas: {                useCORS: true,            },
        },
    });

    const handleReporte = async (e) => {
        e.preventDefault();
        console.log(reporte) 
        reporte.empresaId=currentUser?.empresa[0]._id
        pagoDataService.reportepago(reporte)
            .then(function (response) {
                setPago(response.data)
                console.log(response.data)
            })
            
        pagoDataService.reportepago_metodo(reporte)
            .then(function (response) {
                setMetodo(response.data)
            })
        pagoDataService.reportepago_categoria(reporte)
            .then(function (response) {
                setCategoria(response.data)
            })            
    }
    const columns =
    [
        { header: 'moneda',accessorKey: 'moneda'},
        { header: 'categoria',accessorKey: 'categoria'},
        { header: 'fecha',accessorKey: 'fecha'},
        { header: 'metodo_pago',accessorKey: 'metodo_pago'},
        { header: 'concepto',accessorKey: 'concepto'},
        { header: 'importe',accessorKey: 'importe'},
        { header: 'proveedordesc',accessorKey: 'proveedordesc'},

    ]
    
    const data = [
        {
          total: 80,
          metodo: 'yape'
        },
        {
            total: 180,
            metodo: 'plin'
          },
      ];
    useEffect(() => {
        const fecha = new Date();
        //console.log(fecha)
        reporte.fec_crea = moment().add(-7, 'd').format('yyyy-M-DD')
        reporte.fec_modi = moment().format('yyyy-M-DD')
        reporte.proveedorId = ""
        proveedorDataService.getproveedor(currentUser?.empresa[0]._id)
            .then(response => response.json())
            .then(response => {
                setProveedor(response);
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
                                <h3 className="mb-1 text-light">Reporte de Pagos</h3>
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
                                            <label className="form-label" id="inputGroup-sizing-sm">Proveedor</label>
                                            <select className="form-control" required onChange={handleChange}
                                                name="proveedorId">
                                                <option value="">[Todos]</option>
                                                <DDlProveedor empresaId={currentUser?.empresa[0]._id}/>
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
                                  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {pago.length > 0 ?
                <>
                    <div ref={targetRef}>
                        <h1 className="anchor fw-bold mb-5" id="basic" data-kt-scroll-offset="50">
                            <a href="#basic"></a>Reporte de Pago</h1>
                        <div className="py-5">
                            Fecha: {reporte.fec_crea + ' al ' + reporte.fec_modi}
                        </div>
                        <div className="row">

                            <div className="col-lg-12">
                                <MaterialReactTable columns={columns} data={pago}
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
                </> : <></>}

        </>
    );
} 