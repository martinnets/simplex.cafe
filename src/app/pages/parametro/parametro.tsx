
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import parametroDataService from "../../../_services/parametro";
import DataTable from 'react-data-table-component';
import { useAuth } from "../../modules/auth";
const columns_ = [
  {
    name: 'parametro',
    cell: (row: any) => (
      <div>
        <Link to={"/parametroedit?id=" + row.id_parametro} 
        className="btn btn-icon btn-outline ">
          <i className="fa-solid fa-edit "></i>
        </Link>
      </div>
    ), selector: (row: any) => row.id_parametro, sortable: true
  },
    { name: 'codigo', 
    selector: (row: any) => row.codigo, sortable: true },        
    { name: 'parametro', 
    selector: (row: any) => row.parametro, sortable: true },        
    { name: 'dominio', 
    selector: (row: any) => row.dominio, sortable: true },        
];
export function ParametroPage() {
  const { currentUser } = useAuth()

    const [parametro, setparametro] = useState([]);
    useEffect(() => {
        parametroDataService.getparametro(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setparametro(response)
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
                  <h3 className="card-title  text-light">Listado de Parametro</h3>
                  <div className="card-toolbar">
                    <Link to={"/parametroform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Parametro
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns_}
                    data={parametro}
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