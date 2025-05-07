
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import almacenDataService from "../../../_services/almacen";
import DataTable from 'react-data-table-component';
import { useAuth } from "../../modules/auth";

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const columns_ = [
  {
    name: 'Acción',
    cell: (row: any) => (
      <div>
        <Link to={"/almacenform?id=" + row._id} 
        className="btn btn-icon btn-outline ">
          <i className="fa-solid fa-edit "></i>
        </Link>
      </div>
    ), selector: (row: any) => row.id_almacen, sortable: true
  },
    { name: 'Codigo', 
    selector: (row: any) => row.Codigo, sortable: true },        
    { name: 'Almacen', 
    selector: (row: any) => row.almacen, sortable: true },        
    { name: 'Direccion', 
    selector: (row: any) => row.direccion, sortable: true },        
    { name: 'Telefono', 
    selector: (row: any) => row.telefono, sortable: true },        
     
];
export function AlmacenPage() {
  const { currentUser } = useAuth()

    const [almacen, setalmacen] = useState([]);
    const exportToCSV = (csvData, fileName) => {
      const ddlreporte = [];
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    useEffect(() => {
        almacenDataService.getalmacen(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setalmacen(response)
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
                  <h3 className="card-title  text-light">Listado de Almacen</h3>
                  <div className="card-toolbar">
                    <Link to={"/almacenform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Almacen
                    </Link>
                    <button  className="btn btn-success btn-sm"
                    onClick={(e) => exportToCSV(almacen,'Reporte de Almacen')}>
                    <i className="fa-solid fa-file-excel "></i>Exportar</button>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns_}
                    data={almacen}
                    pagination
                  />
                </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
} 