
import React, { Component, useState, useEffect, useCallback } from "react";
import { useAuth } from "../../modules/auth";
import { Link, useNavigate } from "react-router-dom";
import ingresoDataService from "../../../_services/ingreso";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
import {    cellKeyboardShortcuts, MaterialReactTable,MRT_ActionMenuItem,MRT_AggregationFns,MRT_ColumnDef,useMaterialReactTable} from 'material-react-table';
import { Ingreso } from "../../../_models/ingreso";
import { Button } from "react-bootstrap";


export function IngresoPage() {
  const navigate = useNavigate();
  const [elementosel, setElemento] = useState<Ingreso>({});
  const { currentUser } = useAuth()
  const [ingreso, setingreso] = useState([]);
  const exportToCSV = (csvData, fileName) => {
    const ddlreporte = [];
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  const columns = [
    { accessorKey: '_id', header: 'Acción',size:10 ,
      Cell: ({cell,row}) => {
        if (row.original.codigo_estado=='1'){
          return <> 
                <Link to={"/ingresoform?id="+cell.getValue()}
                  className="btn btn-icon btn-sm">
                  <i className="fa-solid fa-edit "></i>            
                </Link>
                  
              </>
        }else {
          return <></>
        }
         
      }
     },
     { accessorKey: 'ingreso', header: 'Correlativo',size:10 ,
      Cell: ({cell,row}) => {
          return <>{String(row.original.ingreso).padStart(8, '0')}</>
      }
    },
    { accessorKey: 'categoria', header: 'Categoria'  ,size:10 },
    { accessorKey: 'fecha', header: 'Fecha',size:10    },
    { accessorKey: 'metodo_pago', header: 'Metodo',size:10    },
    { accessorKey: 'concepto', header :'Concepto',  },
    { accessorKey: 'importe', header: 'Importe',size:10    },
    { accessorKey: 'moneda', header: 'Moneda',size:10   },
    { accessorKey: 'clientedesc', header: 'Cliente', size:40  },
    { accessorKey: 'codigo_estado', header: 'Estado',size:10 ,  
      Cell: ({cell,row}) => {
        if (row.original.codigo_estado=='1'){
          return <span className='badge  badge-primary'>Activo</span>
        }else {
          return <span className='badge  badge-danger'>Anulado</span>
        }
      }
   },
  ];
   const handleDelete = async (item) => {
        const answer = window.confirm("Esta seguro de Anular el Registro?");
         if (answer) {
          //console.log(item) 
          //setElemento(item)
          let index = ingreso.findIndex(itemd => itemd._id === item._id);
          //console.log(index)
          ingresoDataService.updateingreso(item._id, {
            "codigo_estado": 9
            })
          //elementosel.codigo_estado='9'
          ingreso[index].codigo_estado='9'
          //console.log(ingreso) 
        }
    }  
  useEffect(() => {
    ingresoDataService.getingreso(currentUser?.empresa[0]._id)
      .then(response => response.json())
      .then(response => {
        setingreso(response)
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
                <h3 className="card-title  text-light">Listado de Ingreso</h3>
                <div className="card-toolbar">
                  <Link to={"/ingresoreporte"}
                    className="btn  btn-secondary btn-sm">
                    <i className="fa-solid fa-print "></i>
                    Reporte
                  </Link>
                  <Link to={"/ingresoform"}
                    className="btn  btn-primary btn-sm">
                    <i className="fa-solid fa-file fs-1x text-light "></i>
                    Nuevo
                  </Link>
                  <button className="btn btn-success btn-sm"
                    onClick={(e) => exportToCSV(ingreso, 'Reporte de Ingreso')}>
                    <i className="fa-solid fa-file-excel "></i>Exportar</button>
                </div>
              </div>
              
            </div>
            <MaterialReactTable columns={columns} data={ingreso}
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