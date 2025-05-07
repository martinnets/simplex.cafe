
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import sucursalDataService from "../../../_services/sucursal";
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { useAuth } from "../../modules/auth";
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const columns_ = [
  {
    name: 'Acción',
    cell: (row: any) => (
      <div>
        <Link to={"/sucursalform?id=" + row._id} 
        className="btn btn-icon btn-outline ">
          <i className="fa-solid fa-edit "></i>
        </Link>
      </div>
    ), selector: (row: any) => row.id_sucursal, sortable: true
  },
    { name: 'Codigo', 
    selector: (row: any) => row.codigo, sortable: true },        
    { name: 'Descripcion', 
    selector: (row: any) => row.descripcion, sortable: true },        
    { name: 'Direccion', 
    selector: (row: any) => row.direccion, sortable: true },        
    { name: 'Telefono', 
    selector: (row: any) => row.telefono, sortable: true },        
];
export function SucursalPage() {
  const { currentUser } = useAuth()

    const [sucursal, setsucursal] = useState([]);
    const exportToCSV = (csvData, fileName) => {
      const ddlreporte = [];
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    useEffect(() => {
      console.log(currentUser)
      
        sucursalDataService.getsucursal(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setsucursal(response)
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
                  <h3 className="card-title  text-light">Listado de Sucursal</h3>
                  <div className="card-toolbar">
                    <Link to={"/sucursalform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Sucursal
                    </Link>
                    <button  className="btn btn-success btn-sm"
                    onClick={(e) => exportToCSV(sucursal,'Reporte de Sucursal')}>
                    <i className="fa-solid fa-file-excel "></i>Exportar</button>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns_}
                    data={sucursal}
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