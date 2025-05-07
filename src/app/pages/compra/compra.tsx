
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import compraDataService from "../../../_services/compra";
import pagoDataService from "../../../_services/pago";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import moment from "moment";
import { Compra } from "../../../_models/compra";
import { useAuth } from "../../modules/auth";
import { Pago } from "../../../_models/pago";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import { fontWeight } from "html2canvas/dist/types/css/property-descriptors/font-weight";
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export function CompraPage() {
  const { currentUser } = useAuth()
  const [elementosel, setElemento] = useState<Compra>({});
  const [open, setOpen] = useState(false);
  const [pago, setPago] = useState<Pago>({});
  const [compra, setcompra] = useState([]);
  const handleClickOpen = (item) => {
    pago.fecha = moment().format('yyyy-M-DD')
    setElemento(item)
    console.log(item)
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (e) => {
    console.log();
    setPago((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  function crearPago() {
    const answer = window.confirm("Esta seguro de registrar el Cobro?");
    if (answer) {
      if (pago.importe > elementosel.porpagar) {
        alert("El importe a pagar excede el saldo")
      } else {
        if (pago.importe === undefined || pago.metodo_pago === undefined) {
          alert("Debe seleccionar el método de pago y el importe")
        } else if (pago.importe <= 0) {
          alert("El importe debe ser mayor a cero")
        } else if (pago.metodo_pago === '') {
          alert("Debe seleccionar el método de pago")
        } else {
          const fecha = new Date().toJSON();
          pago.compraId = elementosel._id
          pago.num_doc=elementosel.serie+'-'+ elementosel.numero
          pago.proveedorId= elementosel.proveedorId
          pago.tipo_pago="operativo"
          pago.empresaId=currentUser?.empresa[0]._id
          pago.moneda = elementosel.moneda
          pago.categoria = "compra"
          pago.concepto = "Compra -" + elementosel.serie+'-'+ elementosel.numero
          pago.codigo_estado='1'
          pago.usu_crea=currentUser.codigo
          console.log(pago)
          pagoDataService.createpago(pago)
            .then(function (response) {
              console.log(JSON.stringify(response.data));
            })
          let importe = Number(pago.importe) + Number(elementosel.pagado)
          compraDataService.updatecompra(elementosel._id,
            {
              "pagado": Number(pago.importe) + Number(elementosel.pagado),
              "porpagar": elementosel.total - (Number(pago.importe) + Number(elementosel.pagado))
            }
          )
          if (pago.importe == elementosel.porpagar) {
            // elementosel.detalle.map((item) => {
            //   //console.log(item.producto)
            //   kardexDataService.createkardex([{
            //     "productoId": item.productoId,
            //     "producto": item.producto,
            //     "fecha": fecha,
            //     "cantidad": item.cantidad,
            //     "tipo_mov": 0,
            //     "almacenId": item.almacenId
            //   }])
            // })
          }
          elementosel.pagado = importe
          elementosel.porpagar = elementosel.total - importe
          if (importe === elementosel.total) {
            compraDataService.updatecompra(elementosel._id, {
              "codigo_estado": 2
            })
          } else {
            compraDataService.updatecompra(elementosel._id, {
              "codigo_estado": 3
            })
          }
          handleClose()
        }
      }
    }
  }
  const exportToCSV = (csvData, fileName) => {
    const ddlreporte = [];
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  const handleDelete = async (item) => {
    const answer = window.confirm("Esta seguro de Anular el Registro?");
    setElemento(item)
    if (answer) {
      compraDataService.updatecompra(item._id, {
        "codigo_estado": 9
      })
      elementosel.codigo_estado = '9'

    }
  }
  const columns = [
    {
      dataField: '_Id', text: 'Acción', headerClasses: 'text-dark  bg-primary bg-opacity-25 fs-4',formatter: (rowcontent, row) => {
        return (

          <div className="btn-group">

            {row.codigo_estado != '9' ? <>
              <button type="button" className="btn btn-icon"
                onClick={(item) => handleDelete(row)}>
                <i className="fa-solid fa-trash text-danger"></i> </button>
            </> : <></>}

            {row.codigo_estado === '1' || row.codigo_estado === '3' ? <>
              <a type="button" className="btn btn-icon " onClick={(item) => handleClickOpen(row)}>
                <i className="fa-solid fa-sack-dollar fs-1x text-success"></i></a>
            </> : <></>}
          </div>
        )
      }
    },
    {
      dataField: 'codigo_estado', text: 'Estado', headerClasses: 'text-dark  bg-primary bg-opacity-25 fs-4',sort: true, formatter: (rowcontent, row) => {
        return (
          <>
            {row.codigo_estado === '1' ?
              <>
                <span className='badge  badge-warning'>Preparada</span>
              </> :
              <>
                {row.codigo_estado === '2' ?
                  <>
                    <span className='badge  badge-primary'>Cobrado</span>
                  </> :
                  <>
                    {row.codigo_estado == '3' ?
                      <>
                        <span className='badge  badge-danger'>Pendiente</span>
                      </> :
                      <>
                        <span className='badge  badge-info'>Anulada</span>
                      </>}
                  </>}
              </>}
          </>
        )
      }
    },
    {
      dataField: 'tipo_doc', text: 'Tipo', headerClasses: 'text-dark  bg-primary bg-opacity-25 fs-4',sort: true, formatter: (rowcontent, row) => {
        return (
          <>
            {rowcontent == '01' ?
              <>
                <span className='badge  badge-success'>Factura</span>
              </> :
              <>
                <span className='badge  badge-danger'>Boleta</span>
              </>}
          </>
        )
      }
    },
    { dataField: 'serie', text: 'Serie',  headerClasses: 'text-dark  bg-primary bg-opacity-25 fs-4', sort: true, formatter: (rowcontent, row: Compra) => <span className="fs-4">{row.serie + '-' + row.numero}</span> },

    { dataField: 'fecha', text: 'Fecha', headerClasses: 'text-dark  bg-primary bg-opacity-25 fs-4',sort: true ,formatter:(rowcontent)=> <span className="fs-4">{rowcontent}</span> },
    { dataField: 'proveedordesc', text: 'Proveedor',headerClasses: 'text-dark  bg-primary bg-opacity-25 fs-4', sort: true,formatter:(rowcontent)=> <span className="fs-4">{rowcontent}</span> },
    { dataField: 'compradordesc', text: 'comprador', headerClasses: 'text-dark  bg-primary bg-opacity-25 fs-4',sort: true ,formatter:(rowcontent)=> <span className="fs-4">{rowcontent}</span> },
    { dataField: 'condicion_pago', text: 'Condicion',headerClasses: 'text-dark  bg-primary bg-opacity-25 fs-4', sort: true,formatter:(rowcontent)=> <span className="fs-4">{rowcontent}</span> },
    { dataField: 'total', text: 'Total', align: 'right',headerClasses: 'text-dark  bg-primary bg-opacity-25 fs-4', sort: true, formatter: (rowcontent, row) => <h2>{row.total.toFixed(2)}</h2> },
    { dataField: 'porpagar', text: 'Pendiente', align: 'right',headerClasses: 'text-dark  bg-primary bg-opacity-25 fs-4', sort: true, formatter: (rowcontent, row) => <h2 className="text-danger">{row.porpagar.toFixed(2)}</h2> },
    { dataField: 'moneda', text: 'Moneda', headerClasses: 'text-dark  bg-primary bg-opacity-25 fs-4',sort: true ,formatter:(rowcontent)=> <span className="fs-4">{rowcontent}</span> },
  ];
  
  const rowClasses = 'text-danger';

  useEffect(() => {
    compraDataService.getcompra(currentUser?.empresa[0]._id)
      .then(response => response.json())
      .then(response => {
        setcompra(response)
        console.log(response)
      })
      .catch(e => {
        console.log(e);
      });
  }, []);
  return (
    <>
      <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
        <div className='row'>
          <div className="col-lg-12">
            <div className="card card-custom">
              <div className="card-header bg-dark ">
                <h3 className="card-title  text-light">Listado de Comprobantes de Compra</h3>
                <div className="card-toolbar">
                  <Link to={"/compraform"} className="btn btn-sm btn-primary ">
                    <i className="fa-solid fa-file fs-1x text-light"></i>
                    Nuevo Comprobante de Compra
                  </Link>
                  <button className="btn btn-success btn-sm"
                    onClick={(e) => exportToCSV(compra, 'Reporte de Compra')}>
                    <i className="fa-solid fa-file-excel "></i>Exportar</button>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Registrar Pago"}        </DialogTitle>
        <DialogContent>
          <form>
            {elementosel ? <>
              <div className="row mb-7">                  
                  <label className="col-lg-4 fw-bold text-muted">Compra</label>
                  <div className="col-lg-8">                    
                      <span className="fw-semibold fs-6 text-gray-800">{elementosel.serie}-{elementosel.numero}</span>                
                  </div>
                  <label className="col-lg-4 fw-bold text-muted">Total</label>
                  <div className="col-lg-8">                    
                      <span className="fw-semibold fs-6 text-gray-800">{elementosel.total}</span>                
                  </div>
                  <label className="col-lg-4 fw-bold text-muted">Importe a Pagar</label>
                  <div className="col-lg-8">                    
                      <span className="fw-semibold fs-5 text-danger">{elementosel.porpagar}</span>                
                  </div>
              </div>
              <div className="form-group row">
                 

                <div className="col-lg-4  input-group-sm mb-5">
                  <div className="  mb-2">
                    <label className="form-label" id="inputGroup-sizing-sm">Fecha de Pago</label>
                    <input type="date"   defaultValue={pago.fecha} onChange={handleChange}
                      name="fecha"
                      className="form-control text-end bg-light-dark fs-2" />
                  </div>
                </div>
                <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Tipo Documento</label>
                                    <select className="form-control" onChange={handleChange}
                                        name="tipo_doc_pago">
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="tipo_doc_pago" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Número Documento</label>
                                    <input type="text" name="num_doc" defaultValue={pago.num_doc}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                <div className="col-lg-4  input-group-sm mb-5">
                  <div className="  mb-2">
                    <label className="form-label" id="inputGroup-sizing-sm">Cuenta</label>
                    <select className="form-control" required onChange={handleChange}
                                        name="cuenta">
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="cuenta" />
                                    </select>
                  </div>
                </div>
                <div className="col-lg-4  input-group-sm mb-5">
                  <div className="  mb-2">
                    <label className="form-label" id="inputGroup-sizing-sm">Metodo de Pago</label>
                    <select className="form-control bg-light-dark" required onChange={handleChange}
                      name="metodo_pago" value={pago.metodo_pago}>
                      <option value="">[Seleccione]</option>
                      <DDlParametro dominio="metodo_pago" />
                    </select>
                  </div>
                </div>
                <div className="col-lg-4  input-group-sm mb-5">
                  <div className="  mb-2">
                    <label className="form-label fs-2" id="inputGroup-sizing-sm">Importe a Pagar</label>
                    <input type="text" placeholder="0.00" name="importe" onChange={handleChange}
                      className="form-control text-end bg-light-primary" />
                  </div>
                </div>
              </div>
            </> : <></>}
          </form>
        </DialogContent>
        <DialogActions>
          <button className="btn btn-secondary" onClick={handleClose}>Cerrar</button>
          <button className="btn btn-primary" onClick={crearPago}  >
            Registrar Pago
          </button>

        </DialogActions>
      </Dialog>
    </>
  );
} 