
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import personalDataService from "../../../_services/personal";
import DataTable from 'react-data-table-component';
import { useAuth } from "../../modules/auth";
const columns_ = [
  {
    name: 'personal',
    cell: (row: any) => (
      <div>
        <Link to={"/personalform?id=" + row._id} 
        className="btn btn-icon btn-outline ">
          <i className="fa-solid fa-edit "></i>
        </Link>
      </div>
    ), selector: (row: any) => row.id_personal, sortable: true
  },
    { name: 'Codigo', 
    selector: (row: any) => row.codigo, sortable: true },        
    { name: 'Personal', 
    selector: (row: any) => row.personal, sortable: true },        
    { name: 'Email', 
    selector: (row: any) => row.correo, sortable: true },        
    { name: 'Teléfono', 
    selector: (row: any) => row.telefono, sortable: true },        
    { name: 'Puesto', 
    selector: (row: any) => row.cargo, sortable: true },        
];
export function PersonalPage() {
  const { currentUser } = useAuth()

    const [personal, setpersonal] = useState([]);
    useEffect(() => {
        personalDataService.getpersonal(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setpersonal(response)
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
                  <h3 className="card-title  text-light">Listado de Personal</h3>
                  <div className="card-toolbar">
                    <Link to={"/personalform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Personal
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns_}
                    data={personal}
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