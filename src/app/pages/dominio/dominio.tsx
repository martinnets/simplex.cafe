import React, { Component, useState, useEffect, useCallback, FC, useRef } from "react";
import { Link,  } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import parametroDataService from "../../../_services/parametro";
import dominioDataService from "../../../_services/dominio";
import DataTable from 'react-data-table-component';
import { useAuth } from "../../modules/auth";
type Props = {
  sdominio: string
}
export function DominioPage (props) {
  const { currentUser } = useAuth()
  const [dominio, setdominio] = useState([]);  
  const [pardominio, setParDominio] = useState(null);
  
  const columns_ = [
      {
        name: 'dominio',
        cell: (row: any) => (
          <div>
            <Link to={"/parametroform?id=" + row._id} 
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
      { name: 'parametro', 
        selector: (row: any) => row.parametro, sortable: true },        
        
    ];
  const handleDelete = async  (e ) => {
      e.preventDefault();
      const obj:any = e.target;
      //const sid= obj.rel;
      // console.log(obj)
      // console.log(e.currentTarget.getAttribute("data-value"))
      //console.log(id)
      const answer = window.confirm("Esta seguro de Eliminar el Registro?");
      if (answer) {
        parametroDataService.deleteparametro(e.currentTarget.getAttribute("data-value"))
        .then(function (response) {
          console.log(JSON.stringify(response.data));   
          
        })
          .catch(function (error) {
          console.log(error);
        });
      }
      
    }   
  const location = useLocation();
  const previousPathRef = useRef(location.pathname); 
  useEffect(() => { 
    console.log('Dominio:', location.state); 
    console.log('Anterior:', previousPathRef.current); 
    const data = {
      "empresaId":currentUser?.empresa[0]._id,
      "dominio":location.state
    }
    setParDominio(location.state)
    parametroDataService.getparametroByCod(data)
         .then(function (response) {
           setdominio	(response.data)
           console.log(response.data); 
         })
         .catch(e => {
          console.log(e);
         });
    // Update the ref with the current path 
    previousPathRef.current = location.pathname; 
  }, [location]); 

  //const [count, setCount] = useState(0);

  // const prev = usePrevious(count);
  // useEffect(() => {
  //   console.log(location.state);
  //   console.log(prev);
  // }, []);
  
  // const [count, setCount] = useState(1);

  // const updateCount = useCallback(() => {
  //   setCount(count => count += 1)
  // }, []) // no dependencies!

  // useEffect(() => {
  //   updateCount();
  // }, [updateCount]);

  // useEffect(() => {
  //   setIdDominio(queryParameters.get("id"));
  //   console.log(pardominio)
  //   dominioDataService.getdominio(currentUser?.empresa[0]._id)
  //     .then(response => response.json())
  //     .then(response => {
  //       setdominio(response)
  //       console.log(filterDominio(pardominio))
  //       //console.log(response)
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  //     }, []);
    return (
    <>
      <div className="d-flex flex-column flex-column-fluid" id="kt_docs_content">
          <div className='row'>
            <div className="col-lg-12">
              <div className="card card-custom">
                <div className="card-header bg-dark ">
                  <h3 className="card-title  text-light">Listado de Dominio</h3>
                  <div className="card-toolbar">
                    <Link to={"/parametroform?d="+pardominio} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Registro
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

