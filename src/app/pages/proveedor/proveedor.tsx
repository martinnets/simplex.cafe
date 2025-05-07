
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import proveedorDataService from "../../../_services/proveedor";
import DataTable from 'react-data-table-component';
import { useAuth } from "../../modules/auth";
const columns_ = [
  {
    name: 'proveedor',
    cell: (row: any) => (
      <div>
        <Link to={"/proveedorform?id=" + row._id} 
        className="btn btn-icon btn-outline ">
          <i className="fa-solid fa-edit "></i>
        </Link>
      </div>
    ), selector: (row: any) => row.id_proveedor, sortable: true
  },
    { name: 'tipo_doc', 
    selector: (row: any) => row.tipo_doc, sortable: true },        
    { name: 'nro_doc', 
    selector: (row: any) => row.nro_doc, sortable: true },        
    { name: 'proveedor', 
    selector: (row: any) => row.proveedor, sortable: true },        
    { name: 'direccion', 
    selector: (row: any) => row.direccion, sortable: true },        
    { name: 'telefono', 
    selector: (row: any) => row.telefono, sortable: true },        
    { name: 'email', 
    selector: (row: any) => row.email, sortable: true },        
    { name: 'web', 
    selector: (row: any) => row.web, sortable: true },        
];
export function ProveedorPage() {
  const { currentUser } = useAuth()

    const [proveedor, setproveedor] = useState([]);
    useEffect(() => {
        proveedorDataService.getproveedor(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setproveedor(response)
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
                  <h3 className="card-title  text-light">Listado de Proveedor</h3>
                  <div className="card-toolbar">
                    <Link to={"/proveedorform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Proveedor
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns_}
                    data={proveedor}
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