
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import pagoDataService from "../../../_services/pago";
import moment from "moment";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { useAuth } from "../../modules/auth";
import { Row } from "react-bootstrap";
import { Pago } from "../../../_models/pago";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import {    cellKeyboardShortcuts, MaterialReactTable,MRT_ActionMenuItem,MRT_AggregationFns,MRT_ColumnDef,useMaterialReactTable} from 'material-react-table';
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export function PagoPendientePage() {
  const { currentUser } = useAuth()
  const [open, setOpen] = useState(false);
  const [elementosel, setElemento] = useState<Pago>({});
  const [pagos, setPagos] = useState([]);
  const [pago, setPago] = useState<Pago>();
  const [fechapago, setFecha] = useState(Date);
  const handleClickOpen = (item) => {
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
      const answer = window.confirm("Esta seguro de registrar el Pago?");
      if (answer) {
        
          if (pago.metodo_pago === undefined) {
            alert("Debe seleccionar el método de pago ")
          } else if (pago.importe <= 0) {
            alert("El importe debe ser mayor a cero")
          } else if (pago.metodo_pago === '') {
            alert("Debe seleccionar el método de pago")
          } else {
            const fecha = new Date().toJSON();
            pago.empresaId=currentUser?.empresa[0]._id
            pago.categoria = "pago"
            pago.codigo_estado='1'
            pago.usu_crea=currentUser.codigo
            pagoDataService.updatepago(elementosel._id,pago)
              .then(function (response) {
                console.log(JSON.stringify(response.data));
              })
            
            handleClose()
            CargaPagosPendientes();
        }
      }
    }
    const exportToCSV = (csvData, fileName) => {
      const ddlreporte = [];
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    const columns = [
      { accessorKey: 'codigo_estado', header: 'Estado',  
        Cell: ({cell,row}) => {
          return <>
              <button type="button" className="btn btn-icon"
                  onClick={(item) => handleDelete(row.original)}>
                  <i className="fa-solid fa-trash text-danger"></i> 
              </button>
              <a type="button" className="btn btn-icon " onClick={(item) => handleClickOpen(row.original)}>
                <i className="fa-solid fa-sack-dollar fs-1x text-success"></i>
              </a>
            
          </>
        }},
      { accessorKey: 'fechaprogramado',    header: 'Fecha Programado' , },
      { accessorKey: 'dias',    header: 'Dias' , },
      { accessorKey: 'proveedordesc',    header: 'Proveedor', },
      { accessorKey: 'categoria',    header: 'Categoria' , }, 
      { accessorKey: 'concepto',    header: 'Concepto' , },
      { accessorKey: 'importe',    header: 'Importe',  }, 
      { accessorKey: 'moneda',    header: 'Moneda' ,},
    ]
    function diasrestantes(fec){
      let date1 = new Date();
      let date2 = new Date(fec);
      console.log(date1)
      console.log(fec)
      let Difference_In_Time =
      date2.getTime() - date1.getTime();
      return Math.round
      (Difference_In_Time / (1000 * 3600 * 24));
    }
    const handleDelete = async (item) => {
      const answer = window.confirm("Esta seguro de Anular el Pago Programado?");
      setElemento(item)
      if (answer) {
        pagoDataService.updatepago(item._id, {
          "codigo_estado": 9
        })
        //elementosel.codigo_estado = '9'
        CargaPagosPendientes()
      }
    }
    function CargaPagosPendientes(){
      pagoDataService.getpagopendiente(currentUser?.empresa[0]._id)
      .then(response => response.json())
      .then(response => {
        setPagos(response)
        console.log(response)
      })
      .catch(e => {
        console.log(e);
      });
    }
    useEffect(() => {
      setFecha(moment().format('yyyy-M-DD'));
      CargaPagosPendientes();
      }, []);
    return (
    <>
      <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
          <div className='row'>
            <div className="col-lg-12">
              <div className="card card-custom">
                <div className="card-header bg-dark ">
                  <h3 className="card-title  text-light">Listado de Cuentas por Pagar</h3>
                  <div className="card-toolbar">
                 
                            <Link to={"/pagoprog"} className="btn btn-sm btn-secondary ">
                      <i className="fa-solid fa-calendar-day fs-1x "></i>
                      Nuevo Pago Programado
                    </Link>
                    <Link to={"/pagoform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Pago
                    </Link>
                   
                    <button  className="btn btn-success btn-sm"
                    onClick={(e) => exportToCSV(pago,'Reporte de Pago')}>
                    <i className="fa-solid fa-file-excel "></i>Exportar</button>
                  </div>
                </div>
                <div className="card-body">
                 
                </div>
              </div>
              <MaterialReactTable columns={columns} data={pagos}
                                              
                                              enableTopToolbar={ false}
                                              initialState={{
                                                density: 'compact',
                                              }}
                                            />
          </div>
        </div>
      </div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Registrar Pago"}        </DialogTitle>
        <DialogContent>
          <form>
            {elementosel ? <>
              <div className="row mb-7">                  
                  <label className="col-lg-4 fw-bold text-muted">Pago</label>
                  <div className="col-lg-8">                    
                      <span className="fw-semibold fs-6 text-gray-800">{elementosel.correlativo}</span>                
                  </div>
                  <label className="col-lg-4 fw-bold text-muted">Total</label>
                  <div className="col-lg-8">                    
                      <span className="fw-semibold fs-6 text-gray-800">{elementosel.importe}</span>                
                  </div>
                  <label className="col-lg-4 fw-bold text-muted">Importe a Pagar</label>
                  <div className="col-lg-8">                    
                      <span className="fw-semibold fs-5 text-danger">{elementosel.importe}</span>                
                  </div>
              </div>
              <div className="form-group row">                 
                <div className="col-lg-4  input-group-sm mb-5">
                  <div className="  mb-2">
                    <label className="form-label" id="inputGroup-sizing-sm">Fecha de Pago</label>
                    <input type="date" defaultValue={fechapago}    onChange={handleChange}
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
                                    <input type="text" name="num_doc"
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
                      name="metodo_pago" >
                      <option value="">[Seleccione]</option>
                      <DDlParametro dominio="metodo_pago" />
                    </select>
                  </div>
                </div>
                <div className="col-lg-4  input-group-sm mb-5">
                  <div className="  mb-2">
                    <label className="form-label fs-2" id="inputGroup-sizing-sm">Importe a Pagar</label>
                    <input type="text" placeholder="0.00" name="importe" readOnly defaultValue={elementosel.importe} onChange={handleChange}
                      className="form-control text-end bg-light-primary fs-2x" />
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