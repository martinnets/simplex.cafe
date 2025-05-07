import React, { Component, useState, useEffect, useCallback } from "react";
import ordenDataService from "../../../_services/orden";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import { Proveedor } from "../../../_models/proveedor";
import { Orden } from "../../../_models/orden";
import { Link } from "react-router-dom";
import { usePDF } from 'react-to-pdf';
import { Personal } from "../../../_models/personal";
import { useAuth } from "../../modules/auth";
import { Empresa } from "../../../_models/empresa";

export function OrdenReportePage() {
    const { currentUser } = useAuth()
    const [orden, setOrden] = useState<Orden>({});
    const [proveedor, setProveedor] = useState<Proveedor>({});
    const [comprador, setComprador] = useState<Personal>({});
    const [empresa, setEmpresa] = useState<Empresa>({});
    const [ordendet, setDetalle] = useState([]);
    const queryParameters = new URLSearchParams(window.location.search)
    const idorden = queryParameters.get("id")
    const { toPDF, targetRef } = usePDF({
        filename: 'Orden de Compra-' + orden.orden + '.pdf',
        page: {
            margin: 5,
            format: "A4",
            orientation: "p",
        },
        overrides: {
            pdf: { compress: true, },
            canvas: { useCORS: true, },
        },
    });
    useEffect(() => {
        // console.log(currentUser)
       // setEmpresa(currentUser[0].empresa[0])
        ordenDataService.getordenById(idorden)
            .then(response => response.json())
            .then(response => {
                setOrden(response[0])
                console.log(response[0].detalle)
                //setProveedor(response.proveedor[0])
                //console.log(response[0].detalle[0])
                setProveedor(response[0].proveedor[0])
                setComprador(response[0].comprador[0])
                setDetalle(response[0].detalle)
            })
    }, []);
    return (
        <>
            <div className='app-toolbar py-3 py-lg-6' id='kt_app_toolbar'>
                <div id='kt_app_toolbar_container'
                    className='app-container d-flex flex-stack'>
                    <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                    </h1>
                    <div className='d-flex align-items-center py-1'>
                        <div className='me-4'>
                            <Link to={"/orden"}
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
                                    <h1 className="text-dark">Orden de Compra</h1>
                                    <h1 className="text-dark">{String(orden.orden).padStart(8, '0')}</h1>
                                    <span className="fs-6">RUC: {currentUser.empresa[0].nro_doc}
                                        <br />{currentUser.empresa[0].empresa}
                                    </span>
                                    {orden.codigo_estado==='9'?
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
                                            <span className="text-muted">Orden ID</span>
                                            <span className="fs-5">#{orden.orden}</span>
                                        </div>
                                        <div className="flex-root d-flex flex-column">
                                            <span className="text-muted">Fecha</span>
                                            <span className="fs-5">{orden.fecha}</span>
                                        </div>
                                        <div className="flex-root d-flex flex-column">
                                            <span className="text-muted">Condicion Pago</span>
                                            <span className="fs-5">{orden.condicionpago}</span>
                                        </div>
                                        <div className="flex-root d-flex flex-column">
                                            <span className="text-muted">Moneda</span>
                                            <span className="fs-5">{orden.moneda}</span>
                                        </div>
                                        <div className="flex-root d-flex flex-column">
                                            <span className="text-muted">Comprador</span>
                                            <span className="fs-5">{comprador.nombres}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex flex-column flex-sm-row gap-7 gap-md-10 fw-bold">
                                        <div className="flex-root d-flex flex-column">
                                            <span className="text-muted">Empresa</span>
                                            <span className="fs-6">RUC: {currentUser.empresa[0].nro_doc}
                                                <br />Proveedor:{currentUser.empresa[0].empresa}
                                                <br />Email:{currentUser.empresa[0].email}
                                                <br />Dirección:{currentUser.empresa[0].direccion}</span>
                                        </div>
                                        <div className="flex-root d-flex flex-column">
                                            <span className="text-muted">Proveedor</span>
                                            <span className="fs-6">RUC: {proveedor.nro_doc}
                                                <br />Proveedor:{proveedor.proveedor}
                                                <br />Email:{proveedor.email}
                                                <br />Dirección:{proveedor.direccion}</span>
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
                                                    {ordendet.map((item, index) => {
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
                                                        <td colSpan={4} className="text-end">Subtotal</td>
                                                        <td className="text-end">{Math.round(orden.subtotal).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan={4} className="text-end">IGV (18%)</td>
                                                        <td className="text-end">{Math.round(orden.igv).toFixed(2)}</td>
                                                    </tr>

                                                    <tr>
                                                        <td colSpan={4} className="fs-3 text-gray-900 fw-bold text-end">  Total</td>
                                                        <td className="text-gray-900 fs-3 fw-bolder text-end">{Math.round(orden.total).toFixed(2)}</td>
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