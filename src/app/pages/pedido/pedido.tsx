
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import pedidoDataService from "../../../_services/pedido";
import DataTable, { Alignment } from 'react-data-table-component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { right } from "@popperjs/core";
import { css } from "@mui/styled-engine";
import { useAuth } from "../../modules/auth";
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export function PedidoPage() {
  const { currentUser } = useAuth()
    const [pedido, setpedido] = useState([]);
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
          <div className="btn-group">
            {row.codigo_estado!=9?<>
              <a onClick={handleDelete} data-value={row._id}
              className="btn btn-outline btn-icon btn-sm ">
              <i className="fa-solid fa-trash fs-1x text-danger"></i>
            </a>
            </>:<></>}           
          </div>
        ), selector: (row: any) => row.id_pedido, sortable: true
      },
        { name: 'Correlativo', 
        selector: (row: any) => row.pedido, sortable: true  },        
        { name: 'Fecha', 
        selector: (row: any) => row.fecha, sortable: true },        
        { name: 'Cliente', 
        selector: (row: any) => row.clientedesc, sortable: true },        
        { name: 'Subtotal', 
          cell: (row:any)=>(
            <><span>{row.subtotal.toFixed(2)}</span></>
          ),
        selector: (row: any) => row.subtotal, sortable: true ,style:{  }},
        { name: 'IGV', 
        cell: (row:any)=>(
          <><span>{row.igv.toFixed(2)}</span></>
        ),
        selector: (row: any) => row.igv, sortable: true },
        { name: 'Total', 
          cell: (row:any)=>(
            <><h2>{row.total.toFixed(2)}</h2></>
          ),
        selector: (row: any) => row.total, sortable: true },
        { name: 'Estado', 
        cell: (row: any) => (
          <div>
          {row.codigo_estado==1?
          <>
            <span className='badge  badge-warning'>Pendiente</span>
          </>:
          <>
            {row.codigo_estado==2?
            <>
              <span className='badge  badge-primary'>Procesado</span>
            </>:
            <>
              <span className='badge  badge-danger'>Anulado</span>
            </>}  
          </>}     
          </div>
        ), 
        selector: (row: any) => row.estado, sortable: true },        
        { name: 'vendedor', 
        selector: (row: any) => row.vendedordesc, sortable: true },        
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
        pedidoDataService.updatepedido(e.currentTarget.getAttribute("data-value"),{"codigo_estado":9})
        .then(function (response) {
          console.log(JSON.stringify(response.data));   
          pedidoDataService.getpedido(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setpedido(response)
            //console.log(response)
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
        pedidoDataService.getpedido(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setpedido(response)
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
                  <h3 className="card-title  text-light">Listado de Pedido</h3>
                  <div className="card-toolbar">
                    <Link to={"/pedidoform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Pedido
                    </Link>
                    <button  className="btn btn-success btn-sm"
                    onClick={(e) => exportToCSV(pedido,'Reporte de Pedidos')}>
                    <i className="fa-solid fa-file-excel "></i>Exportar</button>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns_}
                    data={pedido}
                    pagination
                    noDataComponent="No hay registros"
                  />
                </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
} 