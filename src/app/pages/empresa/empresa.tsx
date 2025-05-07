
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import empresaDataService from "../../../_services/empresa";
import DataTable from 'react-data-table-component';
const columns_ = [
  {
    name: 'empresa',
    cell: (row: any) => (
      <div>
        <Link to={"/empresaform?id=" + row._id} 
        className="btn btn-icon btn-outline ">
          <i className="fa-solid fa-edit "></i>
        </Link>
      </div>
    ), selector: (row: any) => row.id_empresa, sortable: true
  },
    { name: 'codigo', 
    selector: (row: any) => row.codigo, sortable: true },        
    { name: 'empresa', 
    selector: (row: any) => row.empresa, sortable: true },        
    { name: 'telefono', 
    selector: (row: any) => row.telefono, sortable: true },        
    { name: 'web', 
    selector: (row: any) => row.web, sortable: true },        
    { name: 'email', 
    selector: (row: any) => row.email, sortable: true },        
    { name: 'direccion', 
    selector: (row: any) => row.direccion, sortable: true },        
    { name: 'telefono', 
    selector: (row: any) => row.telefono, sortable: true },        
    { name: 'logo', 
    selector: (row: any) => row.logo, sortable: true },        
    { name: 'dpto', 
    selector: (row: any) => row.dpto, sortable: true },        
    { name: 'prov', 
    selector: (row: any) => row.prov, sortable: true },        
    { name: 'dist', 
    selector: (row: any) => row.dist, sortable: true },        
];
export function EmpresaPage() {
    const [empresa, setempresa] = useState([]);
    useEffect(() => {
        empresaDataService.getempresa()
          .then(response => response.json())
          .then(response => {
            setempresa(response)
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
                  <h3 className="card-title  text-light">Listado de Empresa</h3>
                  <div className="card-toolbar">
                    <Link to={"/empresaform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Empresa
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns_}
                    data={empresa}
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