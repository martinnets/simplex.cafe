import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ordenDataService from "../../../_services/orden";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Orden } from "../../../_models/orden";
import moment from "moment";
import { useAuth } from "../../modules/auth";
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export function OrdenPage() {
    const { currentUser } = useAuth()
    const [orden, setorden] = useState([]);
    const [elementosel, setElemento] = useState<Orden>({});
    const exportToCSV = (csvData, fileName) => {
      const ddlreporte = [];
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    const handleDelete = async (item) => {
      const answer = window.confirm("Esta seguro de Anular el Registro?");
      setElemento(item)
      if (answer) {
        ordenDataService.updateorden(item._id,{
          "codigo_estado":9
        })
        elementosel.codigo_estado='9'

      }
  }
    const columns = [
      {  dataField: '_Id',   text: 'Acción' ,formatter: (rowcontent,row:Orden) => {
        return (
          <div className="btn-group" role="group" aria-label="Button group with nested dropdown">           
              {row.codigo_estado!='9'?<>
              <a className="btn btn-outline btn-icon btn-sm " onClick={(item)=> handleDelete(row)}>
                <i className="fa-solid fa-trash fs-1x text-danger"></i></a>
              </>:<></>} 
          </div>
        )
      } }, 
      { dataField: 'codigo_estado',    text: 'Estado',sort:true ,formatter: (rowcontent,row) => {
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
      } }, 
      { dataField: 'orden',    text: 'Orden' ,sort:true ,formatter: (rowcontent,row) => {
        return (
          <>
            <Link to={"/ordenreporte?id="+ row._id } className=""   >
                {rowcontent}
                </Link>
          </>
        )
      } },
      { dataField: 'fecha',    text: 'Fecha' ,sort:true,formatter: (rowcontent,row) => `${row.fecha}`  },
      { dataField: 'proveedor',    text: 'Proveedor' ,sort:true,formatter: (rowcontent,row:Orden) => `${row.proveedor[0].proveedor}`  },
      { dataField: 'condicionpago',   text: 'Condicion' ,sort:true,formatter: (rowcontent,row) => `${row.condicionpago}`  }, 
      { dataField: 'comprador',   text: 'Comprador' ,sort:true,formatter: (rowcontent,row) => `${row.comprador[0].personal}`  }, 
      { dataField: 'subtotal',    text: 'Sub Total',align:'right' ,sort:true,formatter: (rowcontent,row) => <span>{row.subtotal.toFixed(2)}</span>  }, 
      { dataField: 'igv',    text: 'IGV',align:'right' ,sort:true,formatter: (rowcontent,row) => <span>{row.igv.toFixed(2)}</span>  }, 
      { dataField: 'total',    text: 'Total',align:'right' ,sort:true,formatter: (rowcontent,row) => <h2>{row.total.toFixed(2)}</h2>  }, 
      { dataField: 'moneda',    text: 'Moneda' ,sort:true },
    ];
    useEffect(() => {
        ordenDataService.getorden(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setorden(response)
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
                  <h3 className="card-title  text-light">Listado de Orden</h3>
                  <div className="card-toolbar">
                    <Link to={"/ordenform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Orden
                    </Link>
                    <button  className="btn btn-success btn-sm"
                    onClick={(e) => exportToCSV(orden,'Reporte de Orden')}>
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
    </>
  );
} 