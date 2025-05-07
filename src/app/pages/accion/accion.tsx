
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import accionDataService from "../../../_services/accion";
import { useAuth } from "../../modules/auth";
import {    cellKeyboardShortcuts, MaterialReactTable,MRT_ActionMenuItem,MRT_AggregationFns,MRT_ColumnDef,useMaterialReactTable} from 'material-react-table';


export function AccionPage() {
    const { currentUser } = useAuth()
    const [accion, setaccion] = useState([]);
    const  columns = [
      { accessorKey: '_id', header: 'Acción',size:10 ,
                  Cell: ({cell}) => {
                    const row = cell.getValue();
                    return   <>
                    <Link to={"/accionform?id="+cell.getValue()}
                        className="btn btn-icon btn-sm">
                        <i className="fa-solid fa-edit "></i>
                        
                      </Link>
                
                        
                    </> 
                },
        },
        { accessorKey: 'fecha_inicio', header: 'fecha_inicio' },
        { accessorKey: 'hora_inicio', header: 'hora_inicio' },
        { accessorKey: 'fecha_fin', header: 'fecha_fin' },
        { accessorKey: 'hora_fin', header: 'hora_fin' },
        { accessorKey: 'leadId', header: 'leadId' },
        { accessorKey: 'oportunidadId', header: 'oportunidadId' },
        { accessorKey: 'descripcion', header: 'descripcion' },
        { accessorKey: 'prioridad', header: 'prioridad' },
        { accessorKey: 'responsableId', header: 'responsableId' },
        { accessorKey: 'comentarios', header: 'comentarios' },
    ]
    useEffect(() => {
        accionDataService.getaccion(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setaccion(response)
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
                  <h3 className="card-title  text-light">Listado de Accion</h3>
                  <div className="card-toolbar">
                    <Link to={"/accionform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Accion
                    </Link>                  
                  </div>
                </div>
                <div className="card-body">
                  
                </div>
              </div>
               <MaterialReactTable columns={columns} data={accion}
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