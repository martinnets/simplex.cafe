
import React, { Component, useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import notaDataService from "../../../_services/nota";
import { Nota } from "../../../_models/nota";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import { Cliente } from "../../../_models/cliente";
import { Personal } from "../../../_models/personal";
import { useReactToPrint } from "react-to-print";
import { useAuth } from "../../modules/auth";


export function NotaView() {
  const { currentUser } = useAuth()

  const [nota, setnota] = useState<Nota>({});
  const [detalle, setDetalle] = useState([]);
  const [personal, setPersonal] = useState<Personal>({});
  const [cliente, setCliente] = useState<Cliente>({});
  const queryParameters = new URLSearchParams(window.location.search)
  const idnota = queryParameters.get("id")
  const componentRef = useRef();

  const printFn = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Nota de Venta-' + nota.nota
  });

  useEffect(() => {
    notaDataService.getnotaById(idnota)
      .then(response => response.json())
      .then(result => {
        setnota(result[0])
        console.log(result[0])
        console.log(result[0].detalle)
        setDetalle(result[0].detalle)
        setCliente(result[0].cliente)
        setPersonal(result[0].personal)
      })
  }, []);
  return (
    <>
      <div>
        <div className="card card-custom">
          <div className="card-header align-items-center py-5 gap-2 gap-md-5">
            <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
              <Link to={"/nota"}
                className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                <i className="fa-solid fa-reply "></i>
                Volver
              </Link>
              <button onClick={() => printFn}
                className="btn btn-secondary me-1 btn-lg"><i className="fa fa-print"></i>
                Imprimir</button>
            </div>
          </div>
        </div>
        <div ref={componentRef}>
          <div className="row justify-content-center p-10">
            <div className="col-12 col-lg-9 col-xl-8 col-xxl-7">
              <div className="row gy-3 mb-3">
                <div className="col-6">
                  <h2 className="text-uppercase text-endx m-0">Nota de Venta</h2>
                </div>
                <div className="col-6">
                  <a className="d-block text-end" href="#!">
                     <img alt="Logo" src={toAbsoluteUrl('media/empresa/')+currentUser?.empresa[0].nro_doc+'.png'}
                                                    className="w-50 " />
                  </a>
                </div>
                <div className="col-12">
                  <h4>Empresa</h4>
                  <address>
                    <strong>Optica Ely</strong>
                    Lima
                    Teléfono: (51)951959959
                    Email: email@domain.com
                  </address>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-6 col-sm-6 col-md-8">
                  <h4>Cliente:</h4>
                  <address>
                    <strong>{cliente.cliente}</strong>
                    Teléfono: {cliente.telefono}
                    Email: {cliente.email}
                  </address>
                </div>
                <div className="col-6 col-sm-6 col-md-8">
                  <h4>Estado:</h4>
                  <h3>{nota.codigo_estado === '1' ?
                    <>
                      <span className='badge  badge-warning'>Preparada</span>
                    </> :
                    <>
                      {nota.codigo_estado === '2' ?
                        <>
                          <span className='label  '>Cobrado</span>
                        </> :
                        <>
                          {nota.codigo_estado == '3' ?
                            <>
                              <span className='label   label -danger'>Pendiente</span>
                            </> :
                            <>
                              <span className='label   label -info'>Anulada</span>
                            </>}
                        </>}
                    </>}</h3>
                </div>
                <div className="col-12 col-sm-6 col-md-4">
                  <h4 className="row">
                    <span className="col-6">Nota #</span>
                    <span className="col-6 text-sm-end">{nota.nota}</span>
                  </h4>
                  <div className="row">
                    <span className="col-6">Referencia</span>
                    <span className="col-6 text-sm-end">{nota.referencia}</span>
                    <span className="col-6">Fecha</span>
                    <span className="col-6 text-sm-end">{nota.fecha}</span>
                    <span className="col-6">Vendedor</span>
                    <span className="col-6 text-sm-end">{personal.nombres}</span>
                    <span className="col-6">Moneda</span>
                    <span className="col-6 text-sm-end">{nota.moneda}</span>
                  </div>

                </div>
              </div>
              <div className="row mb-3">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th scope="col" className="text-uppercase">Item</th>
                          <th scope="col" className="text-uppercase">Producto</th>
                          <th scope="col" className="text-uppercase">Cantidad</th>
                          <th scope="col" className="text-uppercase text-end">Precio</th>
                          <th scope="col" className="text-uppercase text-end">Total</th>
                        </tr>
                      </thead>
                      <tbody className="table-group-divider">
                        {detalle.map((item, index) => (
                          <tr>
                            <th scope="row">{index + 1}</th>
                            <td>{item.producto}</td>
                            <td className="text-center">{item.cantidad}</td>
                            <td className="text-end">{item.precio_unitario}</td>
                            <td className="text-end">{item.precio_unitario * item.cantidad}</td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={4} className="text-end">Total</td>
                          <td className="text-end fs-2x">{nota.total}</td>
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
    </>
  );
} 