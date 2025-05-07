
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import ordendetDataService from "../../../_services/ordendet";
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const columns_ = [
  {
    name: 'Acción',
    cell: (row: any) => (
      <div>
        <Link to={"/ordendetform?id=" + row._id} 
        className="btn btn-icon btn-outline ">
          <i className="fa-solid fa-edit "></i>
        </Link>
      </div>
    ), selector: (row: any) => row.id_ordendet, sortable: true
  },
    { name: 'Orden', 
    selector: (row: any) => row.orden, sortable: true },        
    { name: 'ProductoId', 
    selector: (row: any) => row.productoId, sortable: true },        
    { name: 'Producto', 
    selector: (row: any) => row.producto, sortable: true },        
    { name: 'Cantidad', 
    selector: (row: any) => row.cantidad, sortable: true },        
    { name: 'Precio_unitario', 
    selector: (row: any) => row.precio_unitario, sortable: true },        
    { name: 'Subtotal', 
    selector: (row: any) => row.subtotal, sortable: true },        
    { name: 'Igv', 
    selector: (row: any) => row.igv, sortable: true },        
    { name: 'Total', 
    selector: (row: any) => row.total, sortable: true },        
];
export function OrdendetPage() {
    const [ordendet, setordendet] = useState([]);
    const exportToCSV = (csvData, fileName) => {
      const ddlreporte = [];
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    useEffect(() => {
        ordendetDataService.getordendet()
          .then(response => response.json())
          .then(response => {
            setordendet(response)
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
                  <h3 className="card-title  text-light">Listado de Ordendet</h3>
                  <div className="card-toolbar">
                    <Link to={"/ordendetform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Ordendet
                    </Link>
                    <button  className="btn btn-success btn-sm"
                    onClick={(e) => exportToCSV(ordendet,'Reporte de Ordendet')}>
                    <i className="fa-solid fa-file-excel "></i>Exportar</button>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns_}
                    data={ordendet}
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