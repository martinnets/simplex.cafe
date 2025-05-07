
import React, { Component, useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import pagoDataService from "../../../_services/pago";
import proveedorDataService from "../../../_services/proveedor";
import personalDataService from "../../../_services/personal";
import kardexDataService from "../../../_services/kardex";
import { Proveedor } from "../../../_models/proveedor";
import { Reporte } from "../../../_models/reporte";
import { usePDF } from 'react-to-pdf';
import { Pago } from "../../../_models/pago";
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, LabelList, Label, Text } from "recharts";
import { DDlProveedor } from "../../../_metronic/layout/components/select/proveedor";
import { useAuth } from "../../modules/auth";
import { DDLAlmacen } from "../../../_metronic/layout/components/select/almacen";
import { DDlSucursal } from "../../../_metronic/layout/components/select/sucursal";
import moment from "moment";

export function KardexReportePage() {
    const { currentUser } = useAuth()
    const [reporte, setReporte] = useState<Reporte>({});
    const [kardex, setKardex] = useState([]);

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
            pdf: { compress: true, },
            canvas: { useCORS: true, },
        },
    });

    const handleReporte = async (e) => {
        e.preventDefault();
        reporte.empresaId=currentUser?.empresa[0]._id
        console.log(reporte)
        var result = [];
        kardexDataService.kardexReporteKPI(reporte)
            .then(function (response) {
                setKardex(response.data)
                console.log(response.data)
                //{kardex.reduce((acc, pilot) => acc + Number(pilot.sumingreso), 0)}
                response.data.reduce(function(res, value) {
                    if (!res[value.tipo]) {
                            res[value.tipo] = { tipoubica: value.tipo, sumingreso: 0 };
                            result.push(res[value.tipo])
                        }
                            res[value.tipo].sumingreso += Number(value.sumingreso);
                        return res;
                    }, {});            
                console.log(result)
            })
            .catch(e => {
                console.log(e);
            });
        
        
    }
    const columns = [
        { dataField: 'almacen', text: 'Almacen', sort: true },
        { dataField: 'tipo', text: 'Tipo', sort: true },
        { dataField: 'ubicacion', text: 'Ubicacion', align: 'right', sort: true },
        { dataField: 'sumingreso', text: 'Ingresos', align: 'right', sort: true },
        { dataField: 'sumsalida', text: 'Salidas', align: 'right', sort: true },
       
    ];
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
        
        reporte.fec_crea=moment().format('yyyy-M-DD')

    }, []);
    return (
        <>
            <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
                <div className='row'>
                    <div className="col-lg-12">
                        <div className="card ">
                            <div className="card-header bg-dark ">
                                <h3 className="card-title  text-light">Reporte de Inventario</h3>
                                <div className="card-toolbar">                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row">

                                    <div className="col-lg-8  input-group-sm mb-5">
                                        <div className="  mb-2">
                                            <label className="form-label" id="inputGroup-sizing-sm">Sucursal:</label>
                                            <select className="form-control" required onChange={handleChange}
                                                name="sucursalId">
                                                <option value="">[Seleccione]</option>
                                                <DDlSucursal empresaId={currentUser.empresa[0]._id} />
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-lg-4  ">
                                        <div className=" btn-group pt-5">
                                            <label className="form-label" id="inputGroup-sizing-sm">  </label>
                                            <button onClick={handleReporte} className='btn btn-dark ' >
                                                <i className="fa-solid fa-floppy-disk"></i>
                                                Generar Reporte</button>
                                            <button className='btn  btn-danger  btn-sm '
                                                onClick={() => toPDF()}>
                                                <i className="fa-solid fa-file-pdf fs-1x text-light"></i>
                                                Genera     PDF</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {kardex.length > 0 ?
                <>
                    <div ref={targetRef}>
                        <h1 className="anchor fw-bold mb-5" id="basic" data-kt-scroll-offset="50">
                            <a href="#basic"></a>Reporte de Inventario</h1>
                        <div className="py-5">
                        Fecha: {reporte.fec_crea}
                        </div>
                        <div className="row">
                          
                            <div className="col-xl-4">
                                <div className="btn btn-outline btn-outline-dashed btn-light-primary d-flex flex-stack text-start p-6 mb-5">
                                    <div className="d-flex align-items-center me-2">
                                        <div className="form-check form-check-custom form-check-solid form-check-primary me-6">
                                            <i className="fa-solid fa-boxes-stacked fs-3x"></i>
                                        </div>
                                        <div className="flex-grow-2">
                                            <span className="d-flex align-items-center fs-3 fw-bold flex-wrap hover:text-light">
                                                Unidades
                                            </span>
                                            <div className="fw-semibold opacity-50">
                                                x Ingreso
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ms-5">
                                        <span className="mb-2"></span>
                                        <span className="fs-2x fw-bold">
                                            {kardex.reduce((acc, pilot) => acc + Number(pilot.sumingreso), 0)}
                                        </span>
                                        <span className="fs-7 opacity-50">
                                            <span data-kt-element="period"></span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4">
                                <div className="btn btn-outline btn-outline-dashed btn-light-danger d-flex flex-stack text-start p-6 mb-5">
                                    <div className="d-flex align-items-center me-2">
                                        <div className="form-check form-check-custom form-check-solid form-check-primary me-6">
                                            <i className="fa-solid fa-boxes-stacked fs-3x"></i>
                                        </div>
                                        <div className="flex-grow-2">
                                            <span className="d-flex align-items-center fs-3 fw-bold flex-wrap hover:text-white">
                                                Unidades
                                            </span>
                                            <div className="fw-semibold opacity-50">
                                                x Salida
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ms-5">
                                        <span className="mb-2"></span>
                                        <span className="fs-2x fw-bold">
                                            {kardex.reduce((acc, pilot) => acc + Number(pilot.sumsalida), 0)}
                                        </span>
                                        <span className="fs-7 opacity-50">
                                            <span data-kt-element="period">{ }</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-4">
                                <div className="btn btn-outline btn-outline-dashed btn-light-success d-flex flex-stack text-start p-6 mb-5">
                                    <div className="d-flex align-items-center me-2">
                                        <div className="form-check form-check-custom form-check-solid form-check-primary me-6">
                                            <i className="fa-solid fa-cubes fs-3x"></i>
                                        </div>
                                        <div className="flex-grow-2">
                                            <span className="d-flex align-items-center fs-3 fw-bold flex-wrap hover:text-light">
                                                Stock
                                            </span>
                                            <div className="fw-semibold opacity-50">
                                                Total
                                            </div>
                                        </div>
                                    </div>
                                    <div className="ms-5">
                                        <span className="mb-2"></span>
                                        <span className="fs-2x fw-bold">
                                            {kardex.reduce((acc, pilot) => acc + Number(pilot.sumingreso - pilot.sumsalida), 0)}
                                        </span>
                                        <span className="fs-7 opacity-50">
                                            <span data-kt-element="period">{ }</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">

                            <div className="col-lg-12">
                                <div className="table-responsive">
                                   
                                </div>
                            </div>
                          

                        </div>
                    </div>
                </> : <></>}

        </>
    );
} 