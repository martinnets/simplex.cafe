
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import dominioDataService from "../../../_services/dominio";
import DataTable from 'react-data-table-component';
import { useAuth } from "../../modules/auth";

export function DominioDetallePage() {
  const { currentUser } = useAuth()
  const [dominio, setdominio] = useState([]);
  const columns_ = [
      {
        name: 'dominio',
        cell: (row: any) => (
          <div>
            <Link to={"/dominioform?id=" + row._id} 
              className="btn btn-icon  btn-sm ">
                <i className="fa-solid fa-edit fs-1x text-primary"></i>
              </Link>
              <a onClick={handleDelete} data-value={row._id}
              className="btn btn-outline  btn-sm fs-1x ">
                <i className="fa-solid fa-trash fs-1x text-danger"></i>
              </a>
          </div>
        ), selector: (row: any) => row.id_dominio, sortable: true
      },
        { name: 'codigo', 
        selector: (row: any) => row.codigo, sortable: true },        
        { name: 'dominio', 
        selector: (row: any) => row.dominio, sortable: true },        
    ];
  const handleDelete = async  (e ) => {
      e.preventDefault();
      const obj:any = e.target;
      const answer = window.confirm("Esta seguro de Eliminar el Registro?");
      if (answer) {
        dominioDataService.deletedominio(e.currentTarget.getAttribute("data-value"))
        .then(function (response) {
          console.log(JSON.stringify(response.data));   
        })
          .catch(function (error) {
          console.log(error);
        });
      }
    }
  useEffect(() => {
    dominioDataService.getdominio(currentUser?.empresa[0]._id)
      .then(response => response.json())
      .then(response => {
        setdominio(response)
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
                  <h3 className="card-title  text-light">Listado de Dominio</h3>
                  <div className="card-toolbar">
                    <Link to={"/dominioform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Dominio
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns_}
                    data={dominio}
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