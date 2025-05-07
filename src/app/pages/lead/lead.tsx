
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import leadDataService from "../../../_services/lead";
import { useAuth } from "../../modules/auth";
import {    cellKeyboardShortcuts, MaterialReactTable,MRT_ActionMenuItem,MRT_AggregationFns,
  MRT_ColumnDef,useMaterialReactTable} from 'material-react-table';


export function LeadPage() {
    const { currentUser } = useAuth()
    const [lead, setlead] = useState([]);
    const  columns= [
      { accessorKey: '_id', header: 'Acción',size:10 ,
                              Cell: ({cell}) => {
                                const row = cell.getValue();
                                return   <>
                                <Link to={"/leadform?id="+cell.getValue()}
                                    className="btn btn-icon btn-sm">
                                    <i className="fa-solid fa-edit text-primary fs-2 "></i>
                                    
                                  </Link>
                            
                                    
                                </> 
                            },
                    },
        { accessorKey: 'nombre_completo', header: 'nombre_completo' },
        { accessorKey: 'telefono', header: 'telefono' },
        { accessorKey: 'email', header: 'email' },
        { accessorKey: 'direccion', header: 'direccion' },
        { accessorKey: 'empresa', header: 'empresa' },
        { accessorKey: 'cargo', header: 'cargo' },
        { accessorKey: 'fuente', header: 'fuente' },
        { accessorKey: 'nivel_interes', header: 'nivel_interes' },
        { accessorKey: 'presupuesto_estimado', header: 'presupuesto_estimado' },
        { accessorKey: 'necesidad', header: 'necesidad' },
        { accessorKey: 'comentarios', header: 'comentarios' },
        { accessorKey: 'etapa_lead', header: 'etapa_lead' },
    ]
    useEffect(() => {
        leadDataService.getlead(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setlead(response)
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
                  <h3 className="card-title  text-light">Listado de Lead</h3>
                  <div className="card-toolbar">
                    <Link to={"/leadform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Lead
                    </Link>                  
                  </div>
                </div>
                <div className="card-body">
                  
                </div>
              </div>
              <MaterialReactTable columns={columns} data={lead}
              enableGlobalFilter={true}
                  enableTopToolbar={ true}
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