
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import pagoDataService from "../../../_services/pago";
import moment from "moment";

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { useAuth } from "../../modules/auth";
import { Pago } from "../../../_models/pago";
import {    cellKeyboardShortcuts, MaterialReactTable,MRT_ActionMenuItem,MRT_AggregationFns,MRT_ColumnDef,useMaterialReactTable} from 'material-react-table';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export function PagoPage() {
  const { currentUser } = useAuth()
  const [elementosel, setElemento] = useState<Pago>({});
  const [pago, setpago] = useState([]);
  const exportToCSV = (csvData, fileName) => {
      const ddlreporte = [];
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
  const columns = [
       { accessorKey: '_id', header: 'Acción',size:10 ,
            Cell: ({cell}) => {
              const row = cell.getValue();
              return   <>
              <Link to={"/pagoform?id="+cell.getValue()}
                  className="btn btn-icon btn-sm">
                  <i className="fa-solid fa-edit "></i>
                  
                </Link>
              <button type="button" className="btn btn-icon" 
              onClick={(item) => handleDelete(cell.getValue())}>
                <i className="fa-solid fa-trash text-danger"></i> </button>
                  
              </> 
          },
           },
           { accessorKey: 'correlativo', header: 'ID'  },
      { accessorKey: 'fecha',    header: 'Fecha' , },
      { accessorKey: 'metodo_pago',    header: 'Metodo' , },
      { accessorKey: 'proveedordesc',    header: 'Proveedor', },
      { accessorKey: 'categoria',    header: 'Categoria' , }, 
      { accessorKey: 'concepto',    header: 'Concepto' , },
      { accessorKey: 'cuenta',    header: 'Cuenta' ,},
      { accessorKey: 'importe',    header: 'Importe', }, 
      { accessorKey: 'moneda',    header: 'Moneda' , },
    
    ]
  const handleDelete = async (id) => {
      const answer = window.confirm("Esta seguro de Anular el Registro?");
      //setElemento(item)
      if (answer) {
        pagoDataService.deletepago(id)
        // pagoDataService.updatepago(item._id, {
        //   "codigo_estado": 9
        // })
       // elementosel.codigo_estado = '9'
  
      }
    }
    useEffect(() => {
        pagoDataService.getpago(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setpago(response)
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
                  <h3 className="card-title  text-light">Listado de Pago</h3>
                  <div className="card-toolbar">
                  <Link to={"/pagoreporte"} 
                            className="btn  btn-secondary btn-sm">
                            <i className="fa-solid fa-print "></i>
                            Reporte
                            </Link>
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
               
              </div>

              <MaterialReactTable columns={columns} data={pago}
                                  
                                  enableTopToolbar={ false}
                                  initialState={{
                                    density: 'compact',
                                  }}
                                />
          </div>
        </div>
      </div>
    </>
  );
} 