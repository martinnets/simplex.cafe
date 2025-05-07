
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import clienteDataService from "../../../_services/cliente";
import DataTable from 'react-data-table-component';
  import { useAuth } from "../../modules/auth";

export function ClientePage() {
  const { currentUser } = useAuth()

    const [cliente, setcliente] = useState([]);
    const columns_ = [
      {
        name: 'cliente',
        cell: (row: any) => (
          <div>
            <Link to={"/clienteform?id=" + row._id} 
            className="btn btn-icon btn-outline ">
              <i className="fa-solid fa-edit "></i>
            </Link>
            <a onClick={handleDelete} data-value={row._id}
                  className="btn btn-outline btn-icon ">
                  <i className="fa-solid fa-trash fs-1x text-danger"></i>
                </a>
          </div>
        ), selector: (row: any) => row.id_cliente, sortable: true
      },
        { name: 'Documento', 
        selector: (row: any) => row.nro_doc, sortable: true },        
        { name: 'Cliente', 
        selector: (row: any) => row.cliente, sortable: true },        
        { name: 'Direccion', 
        selector: (row: any) => row.direccion, sortable: true },        
        { name: 'Teléfono', 
        selector: (row: any) => row.telefono, sortable: true },        
        { name: 'Email', 
        selector: (row: any) => row.email, sortable: true },        
        { name: 'Edad', 
          selector: (row: any) => row.edad, sortable: true },        
    ];
    
    const handleDelete = async  (e ) => {
      e.preventDefault();
      const obj:any = e.target;
      //const sid= obj.rel;
      //console.log(id)
      const answer = window.confirm("Esta seguro de Eliminar el Registro?");
      if (answer) {
        clienteDataService.deletecliente(e.currentTarget.getAttribute("data-value"))
        .then(function (response) {
          console.log(JSON.stringify(response.data));   
          clienteDataService.getcliente(currentUser?.empresa[0]._id)
            .then(response => response.json())
            .then(response => {
              setcliente(response)
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
        clienteDataService.getcliente(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setcliente(response)
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
                  <h3 className="card-title  text-light">Listado de Cliente</h3>
                  <div className="card-toolbar">
                    <Link to={"/clienteform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Cliente
                    </Link>
                  </div>
                </div>
                <div className="card-body">
                  <DataTable
                    columns={columns_}
                    data={cliente}
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