
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import productoDataService from "../../../_services/producto";
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
        <Link to={"/productoform?id=" + row._id} 
        className="btn btn-icon btn-outline ">
          <i className="fa-solid fa-edit "></i>
        </Link>
      </div>
    ), selector: (row: any) => row.id_producto, sortable: true
  },
    { name: 'Codigo', 
    selector: (row: any) => row.codigo, sortable: true },        
    { name: 'Producto', 
    selector: (row: any) => row.producto, sortable: true },        
    { name: 'Descripcion', 
    selector: (row: any) => row.descripcion, sortable: true },        
    { name: 'Categoria', 
    selector: (row: any) => row.categoria, sortable: true },        
    { name: 'Marca', 
    selector: (row: any) => row.marca, sortable: true },        
    { name: 'Material', 
    selector: (row: any) => row.material, sortable: true },        
    { name: 'Color', 
    selector: (row: any) => row.color, sortable: true },        
    { name: 'Modelo', 
    selector: (row: any) => row.modelo, sortable: true },        
    { name: 'Submarca', 
    selector: (row: any) => row.submarca, sortable: true },        
    { name: 'Grupo', 
    selector: (row: any) => row.grupo, sortable: true },        
    { name: 'Tamaño', 
    selector: (row: any) => row.tamaño, sortable: true },        
    { name: 'Genero', 
    selector: (row: any) => row.genero, sortable: true },        
    { name: 'Precio_unitario', 
    selector: (row: any) => row.precio_unitario, sortable: true },        
    { name: 'Costo_unitario', 
    selector: (row: any) => row.costo_unitario, sortable: true },        
    { name: 'Imagen', 
    selector: (row: any) => row.imagen, sortable: true },        
    { name: 'Tipo_existencia', 
    selector: (row: any) => row.tipo_existencia, sortable: true },        
];
export function ProductoPage() {
  const { currentUser } = useAuth()

    const [producto, setproducto] = useState([]);
    const exportToCSV = (csvData, fileName) => {
      const ddlreporte = [];
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    useEffect(() => {
        productoDataService.getproducto(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setproducto(response)
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
                  <h3 className="card-title  text-light">Listado de Producto</h3>
                  <div className="card-toolbar">
                    <Link to={"/productoform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Producto
                    </Link>
                    <button  className="btn btn-success btn-sm"
                    onClick={(e) => exportToCSV(producto,'Reporte de Producto')}>
                    <i className="fa-solid fa-file-excel "></i>Exportar</button>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns_}
                    data={producto}
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