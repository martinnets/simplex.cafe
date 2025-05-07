
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import kardexDataService from "../../../_services/kardex";
import DataTable from 'react-data-table-component';
import kardex from "../../../_services/kardex";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { useAuth } from "../../modules/auth";
import { Kardex } from "../../../_models/kardex";
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
export function KardexPage() {
  const { currentUser } = useAuth()
  const [elementosel, setElemento] = useState<Kardex>({});

    const [kardex, setkardex] = useState([]);
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
                  <a onClick={(e)=>handleDelete(e)} data-value={row._id}
                  className="btn btn-outline  btn-sm fs-1x ">
                    <i className="fa-solid fa-trash fs-1x text-danger"></i>
                  </a>
          </div>
        ), selector: (row: any) => row.id_kardex, sortable: true
      },
        { name: 'Producto', 
        selector: (row: any) => row.productodesc, sortable: true },        
        { name: 'Fecha', 
        selector: (row: any) => row.fecha, sortable: true },        
        { name: 'Cantidad', 
        selector: (row: any) => row.cantidad, sortable: true },        
        { name: 'Tipo', 
          cell: (row: any) => (
            <div>
              {row.tipo_mov==1?
              <>
              <span className="badge badge-success">Ingreso</span>
              </>:
              <>
              <span className="badge badge-danger">Salida</span>
              </>}
            </div>
          ), 
          selector: (row: any) => row.tipo_mov, sortable: true },        
        { name: 'Almacen', 
        selector: (row: any) => row.almacendesc, sortable: true },  
        { name: 'Ubicación', 
          selector: (row: any) => row.tipo_ubicacion, sortable: true },       
        { name: 'Seccion', 
        selector: (row: any) => row.ubicacion, sortable: true },        
    ];
    const handleDelete = async  (item ) => {
      //e.preventDefault();
      //const obj:any = e.target;
      //const sid= obj.rel;
      //console.log(obj)
      //console.log(e.currentTarget.getAttribute("data-value"))
      //console.log(id)
      const answer = window.confirm("Esta seguro de Eliminar el Registro?");
      if (answer) {
        setElemento(item)
        kardexDataService.updatekardex(item._id, {
          "codigo_estado": 9
        })
        elementosel.codigo_estado = '9'
        // kardexDataService.updatekardex(e.currentTarget.getAttribute("data-value"))
        // .then(function (response) {
        //   console.log(JSON.stringify(response.data));   
        //   kardexDataService.getkardex(currentUser?.empresa[0]._id)
        //   .then(response => response.json())
        //   .then(response => {
        //     setkardex(response)
        //     console.log(response)
        //   })
        //   .catch(e => {
        //     console.log(e);
        //   });
        // })
        //   .catch(function (error) {
        //   console.log(error);
        // });
      }
      
    }

    useEffect(() => {
        kardexDataService.getkardex(currentUser.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setkardex(response)
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
                  <h3 className="card-title  text-light">Listado de Kardex</h3>
                  <div className="card-toolbar">
                    <Link to={"/kardexform?tipo=1"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Ingreso
                    </Link>
                    <Link to={"/kardexform?tipo=0"} className="btn btn-sm btn-danger ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nueva Salida
                    </Link>
                    <button  className="btn btn-success btn-sm"
                    onClick={(e) => exportToCSV(kardex,'Reporte de Kardex')}>
                    <i className="fa-solid fa-file-excel "></i>Exportar</button>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns_}
                    data={kardex}
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