
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import oportunidadDataService from "../../../_services/oportunidad";
import { useAuth } from "../../modules/auth";
import {    cellKeyboardShortcuts, MaterialReactTable,MRT_ActionMenuItem,MRT_AggregationFns,MRT_ColumnDef,useMaterialReactTable} from 'material-react-table';


export function OportunidadPage() {
    const { currentUser } = useAuth()
    const [oportunidad, setoportunidad] = useState([]);
    const  columns = [
      { accessorKey: '_id', header: 'Acción',size:10 ,
                        Cell: ({cell}) => {
                          const row = cell.getValue();
                          return   <>
                          <Link to={"/oportunidadform?id="+cell.getValue()}
                              className="btn btn-icon btn-sm">
                              <i className="fa-solid fa-edit text-primary fs-2 "></i>
                              
                            </Link>
                      
                              
                          </> 
                      },
              },
        { accessorKey: 'nombre', header: 'nombre' },
        { accessorKey: 'leadId', header: 'leadId' },
        { accessorKey: 'valor_estimado', header: 'valor_estimado' },
        { accessorKey: 'probabilidad', header: 'probabilidad' },
        { accessorKey: 'fechaestimada', header: 'fechaestimada' },
        { accessorKey: 'etapa_oportunidad', header: 'etapa_oportunidad' },
        { accessorKey: 'personalId', header: 'personalId' },
        { accessorKey: 'moneda', header: 'moneda' },
    ]
    useEffect(() => {
        oportunidadDataService.getoportunidad(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setoportunidad(response)
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
                  <h3 className="card-title  text-light">Listado de Oportunidad</h3>
                  <div className="card-toolbar">
                    <Link to={"/oportunidadform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Oportunidad
                    </Link>                  
                  </div>
                </div>
                <div className="card-body">
                  
                </div>
              </div>
               <MaterialReactTable columns={columns} data={oportunidad}
                  enableTopToolbar={ false}
                  initialState={{
                    density: 'compact',
                  }}
                />
          </div>
        </div>
      </div>
    </>
  );
} 