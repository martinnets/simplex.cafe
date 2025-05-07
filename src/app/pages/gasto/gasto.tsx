
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import gastoDataService from "../../../_services/gasto";
import DataTable from 'react-data-table-component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
export function GastoPage() {
    const [gasto, setgasto] = useState([]);
    const exportToCSV = (csvData, fileName) => {
      const ddlreporte = [];
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    const columns_ = [
      {
        name: 'Acción',
        cell: (row: any) => (
          <div>
            <a onClick={handleDelete} data-value={row._id}
                  className="btn btn-outline  btn-sm fs-1x ">
                    <i className="fa-solid fa-trash fs-1x text-danger"></i>
                  </a>
          </div>
        ), selector: (row: any) => row.id_gasto, sortable: true
      },
        { name: 'Recibo', 
        selector: (row: any) => row.codigo, sortable: true },        
        { name: 'Fecha', 
        selector: (row: any) => row.fecha, sortable: true },        
        { name: 'Tipo', 
        selector: (row: any) => row.tipo_gasto, sortable: true },        
        { name: 'Categoria', 
          selector: (row: any) => row.grupo, sortable: true },        
        { name: 'Concepto', 
        selector: (row: any) => row.concepto, sortable: true },        
        { name: 'Importe', 
        selector: (row: any) => row.importe, sortable: true },        
        { name: 'Moneda', 
        selector: (row: any) => row.moneda, sortable: true },        
        { name: 'Proveedor', 
        selector: (row: any) => row.proveedor, sortable: true },        
    ];
    const handleDelete = async  (e ) => {
      e.preventDefault();
      const obj:any = e.target;
      //const sid= obj.rel;
      console.log(obj)
      console.log(e.currentTarget.getAttribute("data-value"))
      //console.log(id)
      const answer = window.confirm("Esta seguro de Eliminar el Registro?");
      if (answer) {
        gastoDataService.deletegasto(e.currentTarget.getAttribute("data-value"))
        .then(function (response) {
          console.log(JSON.stringify(response.data));   
          gastoDataService.getgasto()
          .then(response => response.json())
          .then(response => {
            setgasto(response)
            console.log(response)
          })
          .catch(e => {
            console.log(e);
          });
        })
          .catch(function (error) {
          console.log(error);
        });
      }
      
    }
    useEffect(() => {
        gastoDataService.getgasto()
          .then(response => response.json())
          .then(response => {
            setgasto(response)
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
                  <h3 className="card-title  text-light">Listado de Gasto</h3>
                  <div className="card-toolbar">
                    <Link to={"/gastoform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Gasto
                    </Link>
                    <button  className="btn btn-success btn-sm"
                    onClick={(e) => exportToCSV(gasto,'Reporte de Gastos')}>
                    <i className="fa-solid fa-file-excel "></i>Exportar</button>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns_}
                    data={gasto}
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