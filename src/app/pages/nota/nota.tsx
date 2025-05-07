
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import notaDataService from "../../../_services/nota";
import ingresoDataService from "../../../_services/ingreso";
import kardexDataService from "../../../_services/kardex";
import { useAuth } from "../../modules/auth";
//import DataTable from 'react-data-table-component';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Ingreso } from "../../../_models/ingreso";
import { Nota } from "../../../_models/nota";
import moment from "moment";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import { MaterialReactTable,type MRT_ColumnDef, } from "material-react-table";
import { Cell } from "recharts";

export function NotaPage() {
  const { currentUser } = useAuth()
  const [nota, setnota] = useState([]);
  const [open, setOpen] = useState(false);
  const [elementosel, setElemento] = useState<Nota>({});
  const [ingreso, setIngreso] = useState<Ingreso>({});
  const handleClickOpen = (item) => {
    ingreso.fecha = new Date().toISOString().split('T')[0]
    setElemento(item)
    console.log(item)
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  
  const handleDelete = async (item) => {
    const answer = window.confirm("Esta seguro de Anular el Registro?");
    setElemento(item)
    if (answer) {
      notaDataService.updatenota(item._id, {
        "codigo_estado": 9
      })
      ingresoDataService.updateingresonota(item._id)
      elementosel.codigo_estado = '9'

    }
  }
  
  const columns  =  [
    { accessorKey: '_id', header: 'Acción', Cell: ({cell,row}) => {
        return (
          <div className="btn-group" role="group" aria-label="Button group with nested dropdown">      
                {row.original.codigo_estado != '9' ? <>
                  <button type="button" className="btn btn-icon" 
                  onClick={(item) => handleDelete(row)}>
                    <i className="fa-solid fa-trash text-danger fs-2"></i> </button>
                </> : <></>}
                {row.original.codigo_estado==='1' || row.original.codigo_estado==='3'? <>
                  <a type="button"  className="btn btn-icon " onClick={(item) => handleClickOpen(row.original)}>
                    <i className="fa-solid fa-sack-dollar fs-2 text-success"></i></a>

                     <Link to={"/notaform?id="+cell.getValue()}
                                         className="btn btn-icon btn-sm">
                                         <i className="fa-solid fa-edit fs-2 text-primary"></i>            
                                       </Link>
                                      
                </> : <></>}      
                <Link to={"/notareporte?id="+cell.getValue()}
                                         className="btn btn-icon btn-sm">
                                         <i className="fa-solid fa-file-pdf fs-2 text-danger"></i>            
                                       </Link>      
          </div>
        )
      }
    },
    { accessorKey: 'codigo_estado', header: 'Estado', size:10, Cell: ({cell,row}) => {
        return (
          <>
            {row.original.codigo_estado === '1' ?
              <>
                <span className='badge  badge-warning'>Preparada</span>
              </> :
              <>
                {row.original.codigo_estado === '2' ?
                  <>
                    <span className='badge  badge-primary'>Cobrado</span>
                  </> :
                  <>
                    {row.original.codigo_estado == '3' ?
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
    { accessorKey: 'fecha', header: 'Fecha', size:10 },
    { accessorKey: 'cliente', header: 'Cliente', size:10, Cell: ({ row}) => `${row.original.cliente[0].cliente}` },
    { accessorKey: 'usu_crea', header: 'Teléfono', size:10, Cell: ({ row}) => `${row.original.cliente[0].telefono}` },
    { accessorKey: 'vendedor', header: 'Vendedor', size:20, 
      Cell: ({ row}) => `${row.original.personal[0].personal}` },
    { accessorKey: 'total', header: 'Total',  size:10, 
      Cell: ({ row}) => 
      <h2 className="text-end">{row.original.total}</h2> 
    },
    { accessorKey: 'porcobrar', header: 'Pendiente', size:10,  
      Cell: ({row}) => <h2 className="text-danger text-end" >{row.original.porcobrar}</h2> },
    { accessorKey: 'cobrado', header: 'Cobrado',  size:10, Cell: ({cell,row}) => {
         return (
           <><h2 className="text-end" >
            {Intl.NumberFormat('es-ES', {style:'decimal' }).format(row.original.cobrado)}
            </h2></>
         )
       }
    },
    { accessorKey: 'moneda', header: 'Moneda', sort: true ,size:10},
    { accessorKey: 'referencia', header: 'Referencia', sort: true ,size:10},
    
  ];
  function crearingreso() {
    const answer = window.confirm("Esta seguro de registrar el Cobro?");
    if (answer) {
      
      if (ingreso.importe > elementosel.porcobrar) {
        alert("El importe a pagar excede el saldo")
      } else {
        if (ingreso.importe === undefined || ingreso.metodo_pago === undefined) {
          alert("Debe seleccionar el método de pago y el importe")
        } else if (ingreso.importe <= 0) {
          alert("El importe debe ser mayor a cero")
        } else if (ingreso.metodo_pago === '') {
          alert("Debe seleccionar el método de pago")
        } else {
          ingresoDataService.getingresocorrelativo(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(result => {
            let intcorrelativo = 0
            if (result.length===0){              intcorrelativo=1
            }else {              intcorrelativo=(result[0].correlativo)+1            }
            ingreso.ingreso= intcorrelativo
            ingreso.notaId = elementosel._id
            ingreso.empresaId=currentUser?.empresa[0]._id
            ingreso.moneda = elementosel.moneda
            ingreso.categoria = "venta"
            ingreso.concepto = "Nota de Venta -" + elementosel.nota
            ingreso.clienteId = elementosel.clienteId
            ingreso.codigo_estado ='1'
            
            ingresoDataService.createingreso(ingreso)
              .then(function (response) {
                console.log(JSON.stringify(response.data));
              })
            let importe = Number(ingreso.importe) + Number(elementosel.cobrado)
            notaDataService.updatenota(elementosel._id,
              {
                "cobrado": Number(ingreso.importe) + Number(elementosel.cobrado),
                "porcobrar": elementosel.total - (Number(ingreso.importe) + Number(elementosel.cobrado))
              }
            )
            //console.log(ingreso.importe)
            //console.log(elementosel.porcobrar)
            if (ingreso.importe == elementosel.porcobrar) {
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
            elementosel.cobrado = importe
            elementosel.porcobrar = elementosel.total - importe
            if (importe === elementosel.total) {
              notaDataService.updatenota(elementosel._id, {
                "codigo_estado": 2
              })
            } else {
              notaDataService.updatenota(elementosel._id, {
                "codigo_estado": 3
              })
            }
            handleClose()
          })
          
        }
      }
    }
  }
  const generacorrelativo    =():any =>{
    ingresoDataService.getingresocorrelativo(currentUser?.empresa[0]._id)
      .then(response => response.json())
      .then(result => {
        let intcorrelativo = 0
        if (result.length===0){
          intcorrelativo=1
        }else {
          intcorrelativo=(result[0].correlativo)+1
        }
        return intcorrelativo
        })
  }
  const handleChange = (e) => {
    console.log();
    setIngreso((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  function cargarNotas() {
    notaDataService.getnota(currentUser?.empresa[0]._id)
      .then(response => response.json())
      .then(response => {
        setnota(response)
       console.log(response)
      })
      .catch(e => {
        console.log(e);
      });
  }
  useEffect(() => {
    cargarNotas()
  }, []);
  return (
    <>
      <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
        <div className='row'>
          <div className="col-lg-12">
            <div className="card card-custom">
              <div className="card-header bg-dark ">
                <h3 className="card-title  text-light">Listado de Notas de Venta</h3>
                <div className="card-toolbar">
                  <Link to={"/notaform"} className="btn btn-sm btn-primary ">
                    <i className="fa-solid fa-file fs-1x text-light"></i>
                    Nuevo Nota
                  </Link>
                 
                </div>
              </div>
              <div className="card-body ">
                <div className="table-responsive">
                  <MaterialReactTable columns={columns} data={nota}
                    enableTopToolbar={ false}
                    initialState={{
                      density: 'compact',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={open} onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">
          {"Registrar Cobro"}
        </DialogTitle>
        <DialogContent>
          <form>
            {elementosel ? <>
              <div className="row mb-7">
                  
                  <label className="col-lg-4 fw-bold text-muted">Nota</label>
                  <div className="col-lg-8">                    
                      <span className="fw-semibold fs-6 text-gray-800">{elementosel.nota}</span>                
                  </div>
              
                  <label className="col-lg-4 fw-bold text-muted">Total</label>
                  <div className="col-lg-8">                    
                      <span className="fw-semibold fs-6 text-gray-800">{elementosel.total}-{elementosel.moneda}</span>                
                  </div>
                  <label className="col-lg-4 fw-bold text-muted">Importe a Cobrar</label>
                  <div className="col-lg-8">                    
                      <span className="fw-semibold fs-5 text-gray-800">{elementosel.porcobrar}-{elementosel.moneda}</span>                
                  </div>
              </div>
              <div className="form-group row">
                 

                <div className="col-lg-6  input-group-sm mb-5">
                  <div className="  mb-2">
                    <label className="form-label" id="inputGroup-sizing-sm">Fecha de Pago</label>
                    <input type="date"   defaultValue={ingreso.fecha} onChange={handleChange}
                      name="fecha"
                      className="form-control text-end bg-light-dark fs-2" />
                  </div>
                </div>
                <div className="col-lg-6  input-group-sm mb-5">
                  <div className="  mb-2">
                    <label className="form-label" id="inputGroup-sizing-sm">Cuenta</label>
                    <select className="form-control" required onChange={handleChange}
                                        name="cuenta">
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="cuenta" />
                                    </select>
                  </div>
                </div>
                <div className="col-lg-6  input-group-sm mb-5">
                  <div className="  mb-2">
                    <label className="form-label" id="inputGroup-sizing-sm">Metodo de Cobro</label>
                    <select className="form-control bg-light-dark" required onChange={handleChange}
                      name="metodo_pago" value={ingreso.metodo_pago}>
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
                    <label className="form-label fs-2" id="inputGroup-sizing-sm">Importe a Cobrar</label>
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
          <button className="btn btn-primary" onClick={crearingreso}  >
            Registrar Ingreso
          </button>

        </DialogActions>
      </Dialog>

    </>
  );
} 