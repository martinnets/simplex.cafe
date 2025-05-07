
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import consultaDataService from "../../../_services/consulta";
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
        <Link to={"/consultaform?id=" + row._id} 
        className="btn btn-icon btn-outline ">
          <i className="fa-solid fa-edit "></i>
        </Link>
      </div>
    ), selector: (row: any) => row.id_consulta, sortable: true
  },
    { name: 'Rango_od', 
    selector: (row: any) => row.rango_od, sortable: true },        
    { name: 'Rango_oi', 
    selector: (row: any) => row.rango_oi, sortable: true },        
    { name: 'Add_cerca', 
    selector: (row: any) => row.add_cerca, sortable: true },        
    { name: 'Lod_esfera', 
    selector: (row: any) => row.lod_esfera, sortable: true },        
    { name: 'Lod_cilindro', 
    selector: (row: any) => row.lod_cilindro, sortable: true },        
    { name: 'Lod_eje', 
    selector: (row: any) => row.lod_eje, sortable: true },        
    { name: 'Lod_prisma', 
    selector: (row: any) => row.lod_prisma, sortable: true },        
    { name: 'Lod_av', 
    selector: (row: any) => row.lod_av, sortable: true },        
    { name: 'Lod_dip', 
    selector: (row: any) => row.lod_dip, sortable: true },        
    { name: 'Cod_esfera', 
    selector: (row: any) => row.cod_esfera, sortable: true },        
    { name: 'Cod_cilindro', 
    selector: (row: any) => row.cod_cilindro, sortable: true },        
    { name: 'Cod_eje', 
    selector: (row: any) => row.cod_eje, sortable: true },        
    { name: 'Cod_prisma', 
    selector: (row: any) => row.cod_prisma, sortable: true },        
    { name: 'Cod_av', 
    selector: (row: any) => row.cod_av, sortable: true },        
    { name: 'Cod_dip', 
    selector: (row: any) => row.cod_dip, sortable: true },        
    { name: 'Loi_esfera', 
    selector: (row: any) => row.loi_esfera, sortable: true },        
    { name: 'Loi_cilindro', 
    selector: (row: any) => row.loi_cilindro, sortable: true },        
    { name: 'Loi_eje', 
    selector: (row: any) => row.loi_eje, sortable: true },        
    { name: 'Loi_prisma', 
    selector: (row: any) => row.loi_prisma, sortable: true },        
    { name: 'Loi_av', 
    selector: (row: any) => row.loi_av, sortable: true },        
    { name: 'Loi_dip', 
    selector: (row: any) => row.loi_dip, sortable: true },        
    { name: 'Coi_esfera', 
    selector: (row: any) => row.coi_esfera, sortable: true },        
    { name: 'Coi_cilindro', 
    selector: (row: any) => row.coi_cilindro, sortable: true },        
    { name: 'Coi_eje', 
    selector: (row: any) => row.coi_eje, sortable: true },        
    { name: 'Coi_prisma', 
    selector: (row: any) => row.coi_prisma, sortable: true },        
    { name: 'Coi_av', 
    selector: (row: any) => row.coi_av, sortable: true },        
    { name: 'Coi_dip', 
    selector: (row: any) => row.coi_dip, sortable: true },        
];
export function ConsultaPage() {
  const { currentUser } = useAuth()

    const [consulta, setconsulta] = useState([]);
    const exportToCSV = (csvData, fileName) => {
      const ddlreporte = [];
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    useEffect(() => {
        consultaDataService.getconsulta(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setconsulta(response)
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
                  <h3 className="card-title  text-light">Listado de Consulta</h3>
                  <div className="card-toolbar">
                    <Link to={"/consultaform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Consulta
                    </Link>
                    <button  className="btn btn-success btn-sm"
                    onClick={(e) => exportToCSV(consulta,'Reporte de Consulta')}>
                    <i className="fa-solid fa-file-excel "></i>Exportar</button>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns_}
                    data={consulta}
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