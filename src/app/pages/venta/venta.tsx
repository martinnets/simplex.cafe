
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ventaDataService from "../../../_services/venta";
import ingresoDataService from "../../../_services/ingreso";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Venta } from "../../../_models/venta";
import { Ingreso } from "../../../_models/ingreso";
import { useAuth } from "../../modules/auth";
import {    cellKeyboardShortcuts, MaterialReactTable,MRT_ActionMenuItem,MRT_AggregationFns,
  MRT_ColumnDef,useMaterialReactTable} from 'material-react-table';

export function VentaPage() {
  const { currentUser } = useAuth()
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
     const  columns : MRT_ColumnDef<Venta>[]= [
       { accessorKey: '_id', header: 'Acción',size:10 ,
         Cell: ({cell,row}) => {
           if (row.original.codigo_estado=='1'){
             return <> 
                    <Link to={"/ventaform?id="+cell.getValue()}
                     className="btn btn-icon btn-sm">
                     <i className="fa-solid fa-edit fs-2 text-primary"></i>            
                   </Link>
                   <Link to={"/ventarep?id="+cell.getValue()}
                     className="btn btn-icon btn-sm">
                     <i className="fa-solid fa-file-pdf fs-2 text-danger"></i>            
                   </Link>
                   {row.original.codigo_estado==='1' || row.original.codigo_estado==='3'? <>
                    <a type="button"  className="btn btn-icon " 
                    onClick={(item) => handleClickOpen(row.original)}>
                    <i className="fa-solid fa-sack-dollar fs-2 text-success"></i></a>
                    </> : <></>}     
                 </>
           }else {
             return <></>
           }
            
         }
       },
     
    { accessorKey: 'tipo_doc', header: 'Tipo',size:10 ,
      Cell: ({cell,row}) => {
          if (row.original.tipo_doc=='01'){
            return <span className="badge badge-danger">Factura</span>
          }else {
            return <span  className="badge badge-warning">Boleta</span>
          }
      }
    },
    { accessorKey: 'numero', header: 'Documento',size:10 ,
      Cell: ({cell,row}) => {
          return <>{row.original.serie+'-'+String(row.original.numero).padStart(8, '0')}</>
      }
    },
     { accessorKey: 'cliente', header: 'Cliente' },
     { accessorKey: 'fecha', header: 'Fecha',size:10 },
     { accessorKey: 'vencimiento', header: 'Vencimiento',size:10 },
      { accessorKey: 'total', header: 'Total',  size:10, 
           Cell: ({ row}) => 
           <h2 className="text-end">{Intl.NumberFormat('es-ES', {style:'decimal' }).format(row.original.total)}</h2> 
         },
         { accessorKey: 'porcobrar', header: 'Pendiente', size:10,  
           Cell: ({row}) => <h2 className="text-danger text-end" >
            {Intl.NumberFormat('es-ES', {style:'decimal' }).format(row.original.porcobrar)}
           </h2> },
         { accessorKey: 'cobrado', header: 'Cobrado',  size:10, Cell: ({cell,row}) => {
              return (
                <><h2 className="text-end" >
                 {Intl.NumberFormat('es-ES', {style:'decimal' }).format(row.original.cobrado)}
                 </h2></>
              )
            }
         },

  ];
  // const columns_ = [
  //   {
  //     name: 'Acción',
  //     cell: (row: any) => (
  //       <div className="btn-group">
  //         <a onClick={handleDelete} data-value={row._id}
  //           className="btn btn-outline btn-icon ">
  //           <i className="fa-solid fa-trash fs-1x text-danger"></i>
  //         </a>
  //         {row.porcobrar>0?<>
  //           <a onClick={(item) => handleClickOpen(row)}
  //           className="btn btn-outline btn-icon ">
  //           <i className="fa-solid fa-sack-dollar fs-1x text-success"></i>
  //         </a>
  //         </>:<></>}
          
  //       </div>
  //     ), selector: (row: any) => row.id_venta, sortable: true
  //   },
  //   {
  //     name: 'Tipo',
  //     cell: (row: any) => (
  //       <div>
  //         {row.tipo_doc == '01' ?
  //           <>
  //             <span className='badge  badge-success'>Factura</span>
  //           </> :
  //           <>
  //             <span className='badge  badge-danger'>Boleta</span>
  //           </>}
  //       </div>
  //     ),
  //     selector: (row: any) => row.tipo_doc, sortable: true
  //   },
  //   {
  //     name: 'Serie',
  //     cell: (row: any) => (
  //       <><span>{row.serie + '-' + row.numero}</span></>
  //     ),
  //     selector: (row: any) => row.serie, sortable: true
  //   },
  //   {
  //     name: 'Fecha',
  //     selector: (row: any) => row.fecha, sortable: true
  //   },
   
  //   {
  //     name: 'Estado',
  //     cell: (row: any) => (
  //       <div>
  //         {row.codigo_estado == 1 ?
  //           <>
  //             <span className='badge  badge-warning'>Pendiente</span>
  //           </> :
  //           <>
  //             {row.codigo_estado == 2 ?
  //               <>
  //                 <span className='badge  badge-primary'>Procesado</span>
  //               </> :
  //               <>
  //                 <span className='badge  badge-danger'>Anulado</span>
  //               </>}
  //           </>}
  //       </div>
  //     ),
  //     selector: (row: any) => row.codigo_estado, sortable: true
  //   },   
  //   {
  //     name: 'Total',
  //     cell: (row: any) => (
  //       <><h2>{row.total.toFixed(2)}</h2></>
  //     ),
  //     selector: (row: any) => row.total, sortable: true
  //   },
  //   {
  //     name: 'Pendiente',
  //     cell: (row: any) => (
  //       <>
  //       {row.porcobrar>0?
  //       <>
  //       <h2 className="text-danger">{row.porcobrar.toFixed(2)}</h2>
  //       </>:
  //       <>
  //       <h2>{row.porcobrar.toFixed(2)}</h2>
  //       </>}
  //       </>
  //     ),
  //     selector: (row: any) => row.porcobrar, sortable: true
  //   },
  //   {
  //     name: 'Cobrado',
  //     cell: (row: any) => (
  //       <><h2>{row.cobrado.toFixed(2)}</h2></>
  //     ),
  //     selector: (row: any) => row.cobrado, sortable: true
  //   },

  // ];
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
             ingresoDataService.getingresocorrelativo(currentUser?.empresa[0]._id)
                .then(response => response.json())
                .then(result => {
                  let intcorrelativo = 0
                  if (result.length===0){              intcorrelativo=1
                  }else {              intcorrelativo=(result[0].correlativo)+1            }
                  ingreso.ingreso= intcorrelativo
                  ingreso.ventaId= elementosel._id
                  ingreso.fecha= new Date().toISOString().split('T')[0]
                  ingreso.moneda=elementosel.moneda
                  ingreso.categoria="venta"
                  ingreso.concepto ="venta -"+ elementosel.serie+'-'+elementosel.numero
                  ingreso.codigo_estado ='1'
                  ingreso.clienteId = elementosel.clienteId

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

            })           
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
    ventaDataService.getventa(currentUser?.empresa[0]._id)
      .then(response => response.json())
      .then(response => {
        setventa(response)
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
                <h3 className="card-title  text-light">Listado de Venta</h3>
                <div className="card-toolbar">
                  <Link to={"/ventaform"} className="btn btn-sm btn-primary ">
                    <i className="fa-solid fa-file fs-1x text-light"></i>
                    Nuevo Venta
                  </Link>
                  
                </div>
              </div>
              <div className="card-body">
             
              </div>
            </div>
            <MaterialReactTable columns={columns} data={venta}
                  enableTopToolbar={ false}
                  initialState={{
                    density: 'compact',
                  }}
                />
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
                      <input type="text" readOnly   className="form-control" defaultValue={elementosel.cliente} />
                    </div>
                  </div>
                  <div className="col-lg-6  input-group-sm mb-5">
                    <div className="  mb-2">
                      <label className="form-label" id="inputGroup-sizing-sm">Total</label>
                      <input type="text" readOnly 
                        defaultValue={Intl.NumberFormat('es-ES', {style:'decimal' }).format(elementosel.total)}

                        className="form-control text-end" />
                    </div>
                  </div>
                  <div className="col-lg-6  input-group-sm mb-5">
                    <div className="  mb-2">
                      <label className="form-label" id="inputGroup-sizing-sm">Por Cobrar</label>
                      <input type="text" readOnly placeholder="0.00" 
                      defaultValue={Intl.NumberFormat('es-ES', {style:'decimal' }).format(elementosel.porcobrar)}

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
                  <div className="col-lg-12  input-group-sm mb-5">
                    <div className="  mb-2">
                      <label className="form-label" id="inputGroup-sizing-sm">Importe a Cobrar</label>
                      <input type="text" placeholder="0.00" name="importe" onChange={handleChange}
                        className="form-control   text-end bg-light-primary" />
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