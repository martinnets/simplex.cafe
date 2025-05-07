
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import citaDataService from "../../../_services/cita";
import { useAuth } from "../../modules/auth";


import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import moment from "moment";
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export function CitaPage() {
  const { currentUser } = useAuth()

    const [cita, setcita] = useState([]);
    const exportToCSV = (csvData, fileName) => {
      const ddlreporte = [];
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    const columns = [
      {
        dataField: '_id', text: 'Acción', formatter: (rowcontent, row) => {
          return (
            <div className="btn-group">
                <Link type="button" className="btn btn-icon " to={"/citaform?id="+row._id }  >
                  <i className="fa-solid fa-edit fs-1x text-success"></i></Link>
            </div>
          )
        }
      },
      { dataField: 'fecha_inicio', text: 'Fecha', sort: true, formatter: (rowcontent, row) => `${moment(row.fecha_inicio).format('DD-MM-yyyy')}` },
      { dataField: 'sucursaldesc', text: 'Sucursal', sort: true },
      { dataField: 'clientedesc', text: 'Cliente', sort: true },
      { dataField: 'personaldesc', text: 'Doctor', sort: true },
      
    ];
    useEffect(() => {
        citaDataService.getcita(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setcita(response)
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
                  <h3 className="card-title  text-light">Listado de Cita</h3>
                  <div className="card-toolbar">
                    <Link to={"/citaform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Cita
                    </Link>
                    <button  className="btn btn-success btn-sm"
                    onClick={(e) => exportToCSV(cita,'Reporte de Cita')}>
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