
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ventaDataService from "../../../_services/venta";
import ingresoDataService from "../../../_services/ingreso";
import DataTable from 'react-data-table-component';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Venta } from "../../../_models/venta";
import { Ingreso } from "../../../_models/ingreso";
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export function PorCobrarPage() {
  const [venta, setventa] = useState([]);
  const [open, setOpen] = useState(false);
  const [elementosel, setElemento] = useState<Venta>({});
  const [ingreso, setIngreso] = useState<Ingreso>({});
  const handleClickOpen = (item) => {
    setElemento(item)
    console.log(item)
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const exportToCSV = (csvData, fileName) => {
    const ddlreporte = [];
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  const columns_ = [
    {
      name: 'Acción',
      cell: (row: any) => (
        <div className="btn-group">
          <a onClick={handleDelete} data-value={row._id}
            className="btn btn-outline btn-icon ">
            <i className="fa-solid fa-trash fs-1x text-danger"></i>
          </a>
          {row.porcobrar>0?<>
            <a onClick={(item) => handleClickOpen(row)}
            className="btn btn-outline btn-icon ">
            <i className="fa-solid fa-sack-dollar fs-1x text-success"></i>
          </a></>:<></>}
        </div>
      ), selector: (row: any) => row.id_venta, sortable: true
    },
    {
      name: 'Tipo',
      cell: (row: any) => (
        <div>
          {row.tipo_doc == '01' ?
            <>
              <span className='badge  badge-success'>Factura</span>
            </> :
            <>
              <span className='badge  badge-danger'>Boleta</span>
            </>}
        </div>
      ),
      selector: (row: any) => row.tipo_doc, sortable: true
    },
    {
      name: 'Serie',
      cell: (row: any) => (
        <><span>{row.serie + '-' + row.numero}</span></>
      ),
      selector: (row: any) => row.serie, sortable: true
    },
    {
      name: 'Fecha',
      selector: (row: any) => row.fecha, sortable: true
    },
    {
      name: 'Cliente',
      selector: (row: any) => row.cliente, sortable: true
    },
    {
      name: 'Estado',
      cell: (row: any) => (
        <div>
          {row.codigo_estado == 1 ?
            <>
              <span className='badge  badge-warning'>Pendiente</span>
            </> :
            <>
              {row.codigo_estado == 2 ?
                <>
                  <span className='badge  badge-primary'>Procesado</span>
                </> :
                <>
                  <span className='badge  badge-danger'>Anulado</span>
                </>}
            </>}
        </div>
      ),
      selector: (row: any) => row.codigo_estado, sortable: true
    },
    {
      name: 'Total',
      cell: (row: any) => (
        <><h2>{row.total.toFixed(2)}</h2></>
      ),
      selector: (row: any) => row.total, sortable: true
    },
    {
      name: 'Pendiente',
      cell: (row: any) => (
        <>
        {row.porcobrar>0?
        <>
        <h2 className="text-danger">{row.porcobrar.toFixed(2)}</h2>
        </>:
        <>
        <h2>{row.porcobrar.toFixed(2)}</h2>
        </>}
        </>
      ),
      selector: (row: any) => row.porcobrar, sortable: true
    },
    {
      name: 'Cobrado',
      cell: (row: any) => (
        <><h2>{row.cobrado.toFixed(2)}</h2></>
      ),
      selector: (row: any) => row.cobrado, sortable: true
    },


  ];
  const handleDeleteRow = (iditem) => {
    const idindex = venta.findIndex(element => element._id === iditem);
    const product = venta[idindex]
    const newVentas = venta.splice(idindex, 1);
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    const answer = window.confirm("Esta seguro de Eliminar el Registro?");
    const id = e.currentTarget.getAttribute("data-value")
    if (answer) {
      ventaDataService.deleteventa(id)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          handleDeleteRow(id)
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
  function crearingreso() {
    const answer = window.confirm("Esta seguro de registrar el Cobro?");
        if (answer) {
          if (ingreso.importe>elementosel.porcobrar)
          {
            alert("El importe a pagar excede el saldo")
          }else{
            if (ingreso.importe === undefined || ingreso.metodo_pago=== undefined){
              alert("Debe seleccionar el método de pago y el importe")
            }else if (ingreso.importe <=0 ){
              alert("El importe debe ser mayor a cero")
            }else if (ingreso.metodo_pago===''){
              alert("Debe seleccionar el método de pago")
            }else {
            const fecha = new Date().toJSON();
            ingreso.ventaId= elementosel._id
            ingreso.fecha=fecha.toString()
            ingreso.moneda=elementosel.moneda
            ingreso.categoria="venta"
            ingreso.concepto ="venta -"+ elementosel.serie+'-'+elementosel.numero
            //ingreso.cliente= elementosel.cliente
            ingresoDataService.createingreso(ingreso)
              .then(function (response) {
                  console.log(JSON.stringify(response.data));
              })
            let importe  =Number(ingreso.importe)+Number(elementosel.cobrado)
            console.log(importe)
            ventaDataService.updateventa(elementosel._id,
              {
                "cobrado":Number(ingreso.importe)+Number(elementosel.cobrado),
                "porcobrar":elementosel.total-(Number(ingreso.importe)+Number(elementosel.cobrado))
              }
            )
            elementosel.cobrado=importe
            elementosel.porcobrar = elementosel.total-importe
            handleClose()  
          }
          }
         
        }
    
  }
  const handleChange = (e) => {
    console.log();
    setIngreso((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
    }));
  };
  useEffect(() => {
     
  }, []);
  return (
    <>
      <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
        <div className='row'>
          <div className="col-lg-12">
            <div className="card card-custom">
              <div className="card-header bg-dark ">
                <h3 className="card-title  text-light">Cuentas por Cobrar</h3>
                <div className="card-toolbar">
                  
                  <button className="btn btn-success btn-sm"
                    onClick={(e) => exportToCSV(venta, 'Reporte de Cuentas por Cobrar')}>
                    <i className="fa-solid fa-file-excel "></i>Exportar</button>
                </div>
              </div>
              <div className="card-body">
                <DataTable
                  columns={columns_}
                  data={venta}
                  pagination
                />
              </div>
            </div>
          </div>
        </div>

        <Dialog open={open} onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">
            {"Seleccione Producto"}
          </DialogTitle>
          <DialogContent>
            <form>
              {elementosel ? <>
                <div className="form-group row">
                  <div className="col-lg-12  input-group-sm mb-5">
                    <div className="  mb-2">
                      <label className="form-label" id="inputGroup-sizing-sm">Comprobante</label>
                      <input type="text" defaultValue={elementosel.serie+'-'+elementosel.numero} className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6  input-group-sm mb-5">
                    <div className="  mb-2">
                      <label className="form-label" id="inputGroup-sizing-sm">Cliente</label>
                      <input type="text" readOnly   className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6  input-group-sm mb-5">
                    <div className="  mb-2">
                      <label className="form-label" id="inputGroup-sizing-sm">Total</label>
                      <input type="text" readOnly defaultValue={elementosel.total}
                        className="form-control text-end" />
                    </div>
                  </div>
                  <div className="col-lg-6  input-group-sm mb-5">
                    <div className="  mb-2">
                      <label className="form-label" id="inputGroup-sizing-sm">Por Cobrar</label>
                      <input type="text" readOnly placeholder="0.00" defaultValue={elementosel.porcobrar}
                        className="form-control text-end" />
                    </div>
                  </div>
                  <div className="col-lg-6  input-group-sm mb-5">
                    <div className="  mb-2">
                      <label className="form-label" id="inputGroup-sizing-sm">Metodo de Pago</label>
                      <select className="form-control"  required onChange={handleChange}
                                        name="metodo_pago">
                                        <option value="">[Seleccione]</option>
                                        <option value="efectivo">Efectivo</option>
                                        <option value="transferencia">Transferencia</option>
                                        <option value="tc">TC</option>
                                        <option value="td">TD</option>
                                        <option value="yape">Yape</option>
                                        <option value="plin">Plin</option>
                                    </select>
                    </div>
                  </div>
                  <div className="col-lg-6  input-group-sm mb-5">
                    <div className="  mb-2">
                      <label className="form-label" id="inputGroup-sizing-sm">Importe a Cobrar</label>
                      <input type="text" placeholder="0.00" name="importe" onChange={handleChange}
                        className="form-control text-end" />
                    </div>
                  </div>
                  <div className="col-lg-6  input-group-sm mb-5">
                    <div className="  mb-2">
                      <label className="form-label" id="inputGroup-sizing-sm">Pendiente</label>
                      <input type="text" placeholder="0.00" readOnly
                        className="form-control text-end" />
                    </div>
                  </div>
                </div>
              </> : <></>}

            </form>
          </DialogContent>
          <DialogActions>
            <button className="btn btn-secondary" onClick={handleClose}>Cerrar</button>
            <button className="btn btn-primary" onClick={crearingreso}  >
              Registrar Ingreso
            </button>

          </DialogActions>
        </Dialog>
      </div>
    </>
  );
} 