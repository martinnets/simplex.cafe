import React, { Component, useState, useEffect, useCallback } from "react";
import cotizacionDataService from "../../../_services/cotizacion";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import { Cliente } from "../../../_models/cliente";
import { Link } from "react-router-dom";
import { usePDF } from 'react-to-pdf';
import { Personal } from "../../../_models/personal";
import { useAuth } from "../../modules/auth";
import { Empresa } from "../../../_models/empresa";
import { Nota } from "../../../_models/nota";
import { Cotizacion } from "../../../_models/cotizacion";

export function CotizacionReportePage() {
    const { currentUser } = useAuth()
    const [cotizacion, setCotizacion] = useState<Cotizacion>({});
    const [cliente, setCliente] = useState<Cliente>({});
    const [vendedor, setVendedor] = useState<Personal>({});
    //const [empresa, setEmpresa] = useState<Empresa>({});
    const [detalle, setDetalle] = useState([]);
    const queryParameters = new URLSearchParams(window.location.search)
    const idnota = queryParameters.get("id")
    const { toPDF, targetRef } = usePDF({
        filename: 'Cotizacion-' + cotizacion.cotizacion + '.pdf',
        page: { margin: 5, format: "A5", orientation: "p", },
        overrides: {
            pdf: { compress: true, },
            canvas: { useCORS: true, },
        },
    });
    useEffect(() => {
        // console.log(currentUser)
        //setEmpresa(currentUser.empresa[0])
        cotizacionDataService.getcotizacionById(idnota)
            .then(response => response.json())
            .then(response => {
                setCotizacion(response)
                setDetalle(response.detalle)
                console.log(response)
               // console.log(response[0].cliente[0])
                //setProveedor(response.proveedor[0])
                //console.log(response[0].detalle[0])
                // setCliente(response[0].cliente[0])
                // setVendedor(response[0].personal[0])
                // setDetalle(response[0].detalle)
            })
    }, []);
    return (
        <>
            <div className="card card-noborder">
                <div className="card-header align-items-center py-5 gap-2 gap-md-5">
                    <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                        <Link to={"/cotizacion"}
                            className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                            <i className="fa-solid fa-reply "></i>
                            Volver
                        </Link>
                        <button onClick={() => toPDF()}
                            className="btn btn-secondary me-1 btn-lg"><i className="fa fa-print"></i>
                            Imprimir</button>
                    </div>
                </div>
            </div>
            <div ref={targetRef}>
                <div className="row">
                    <div className="col-lg-7 ">
                        <div className="p-10">
                            <img alt="Logo" src={toAbsoluteUrl('media/empresa/')+currentUser?.empresa[0].nro_doc+'.png'}
                                className="w-50 " />
                        </div>
                    </div>
                    <div className="col-lg-5">
                        <div className="p-10">
                            <div className="card card-dashed">
                                <div className="card-body text-center">
                                    <h1 className="text-dark">Cotizacion</h1>
                                    <h1 className="text-dark">
                                        {String(cotizacion.cotizacion).padStart(8, '0')}
                                        </h1>
                                    <span className="fs-6">RUC: {currentUser?.empresa[0].nro_doc}
                                        <br />{currentUser?.empresa[0].empresa}
                                    </span>
                                    {cotizacion.codigo_estado==='9'?
                                    <> <h1 className="text-danger">Anulada</h1></>:
                                    <></>}
                                </div>

                            </div>
                        </div>


                    </div>
                </div>
                <div className="card">
                    <div className="card-body py-20">
                        <div className="mw-lg-950px mx-auto w-100">
                            <div className="pb-12">
                                <div className="d-flex flex-column gap-7 gap-md-10">
                                    <div className="separator"></div>
                                    <div className="d-flex flex-column flex-sm-row gap-7 gap-md-10 fw-bold">
                                        <div className="flex-root d-flex flex-column">
                                            <span className="text-muted">Documento ID</span>
                                            <span className="fs-5">#{cotizacion.cotizacion}</span>
                                        </div>
                                        <div className="flex-root d-flex flex-column">
                                            <span className="text-muted">Fecha</span>
                                            <span className="fs-5">{cotizacion.fecha}</span>
                                        </div>
                                        <div className="flex-root d-flex flex-column">
                                            <span className="text-muted">Referencia</span>
                                            <span className="fs-5">{}</span>
                                        </div>
                                        <div className="flex-root d-flex flex-column">
                                            <span className="text-muted">Moneda</span>
                                            <span className="fs-5">{cotizacion.moneda}</span>
                                        </div>
                                        <div className="flex-root d-flex flex-column">
                                            <span className="text-muted">Vendedor</span>
                                            <span className="fs-5">{vendedor.nombres}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column flex-sm-row gap-7 gap-md-10 fw-bold">
                                        <div className="flex-root d-flex flex-column">
                                            <span className="text-muted">Empresa</span>
                                            <span className="fs-6">RUC: {currentUser?.empresa[0].nro_doc}
                                                <br />Proveedor:{currentUser?.empresa[0].empresa}
                                                <br />Email:{currentUser?.empresa[0].email}
                                                <br />Dirección:{currentUser?.empresa[0].direccion}</span>
                                        </div>
                                        <div className="flex-root d-flex flex-column">
                                            <span className="text-muted">Cliente</span>
                                            <span className="fs-6">RUC: {cliente.nro_doc}
                                                <br />Cliente:{cliente.cliente}
                                                <br />Email:{cliente.email}
                                                <br />Dirección:{cliente.direccion}</span>
                                        </div>

                                    </div>
                                    <div className="d-flex justify-content-between flex-column">
                                        <div className="table-responsive border-bottom mb-9">
                                            <table className="table align-middle table-row-dashed fs-6 gy-5 mb-0">
                                                <thead>
                                                    <tr className="border-bottom fs-6 fw-bold text-muted">
                                                        <th className="min-w-175px pb-2">Item</th>
                                                        <th className="min-w-175px pb-2">Producto</th>
                                                        <th className="min-w-80px text-end pb-2">Cant</th>
                                                        <th className="min-w-80px text-end pb-2">P.Unit</th>
                                                        <th className="min-w-100px text-end pb-2">Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="fw-semibold text-gray-600">
                                                    {detalle.map((item, index) => {
                                                        return (
                                                            <tr>
                                                                <td>{index + 1}</td>
                                                                <td>{item.producto}</td>
                                                                <td className="text-end">{item.cantidad}</td>
                                                                <td className="text-end">{item.precio_unitario}</td>
                                                                <td className="text-end">{item.cantidad * item.precio_unitario}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                    <tr>
                                                        <td colSpan={4} className="fs-3 text-gray-900 fw-bold text-end">  Total</td>
                                                        <td className="text-gray-900 fs-3 fw-bolder text-end">{cotizacion.total}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 