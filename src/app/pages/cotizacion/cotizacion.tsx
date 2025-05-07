
import React, { Component, useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import cotizacionDataService from "../../../_services/cotizacion";
import { useAuth } from "../../modules/auth";
import {    cellKeyboardShortcuts, MaterialReactTable,MRT_ActionMenuItem,MRT_AggregationFns,MRT_ColumnDef,useMaterialReactTable} from 'material-react-table';


export function CotizacionPage() {
    const { currentUser } = useAuth()
    const [cotizacion, setcotizacion] = useState([]);
    const  columns = [
      { accessorKey: '_id', header: 'Acción',size:10 ,
        Cell: ({cell,row}) => {
          if (row.original.codigo_estado=='1'){
            return <> 
                   <Link to={"/cotizacionform?id="+cell.getValue()}
                    className="btn btn-icon btn-sm">
                    <i className="fa-solid fa-edit fs-2 text-primary"></i>            
                  </Link>
                  <Link to={"/cotizacionrep?id="+cell.getValue()}
                    className="btn btn-icon btn-sm">
                    <i className="fa-solid fa-file-pdf fs-2 text-danger"></i>            
                  </Link>
                </>
          }else {
            return <></>
          }
           
        }
      },
      { accessorKey: 'cotizacion', header: 'Correlativo',size:20 ,
        Cell: ({cell,row}) => {
            return <>{String(row.original.cotizacion).padStart(8, '0')}</>
        }
      },
        { accessorKey: 'descripcion', header: 'Descripcion' },
        { accessorKey: 'fecha', header: 'Fecha' },
        { accessorKey: 'moneda', header: 'Moneda' },
        { accessorKey: 'clienteId', header: 'Cliente' },
        { accessorKey: 'vendedorId', header: 'Vendedor' },
        { accessorKey: 'total', header: 'total' },
    ]
    useEffect(() => {
        cotizacionDataService.getcotizacion(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setcotizacion(response)
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
                  <h3 className="card-title  text-light">Listado de Cotizacion</h3>
                  <div className="card-toolbar">
                    <Link to={"/cotizacionform"} className="btn btn-sm btn-primary ">
                      <i className="fa-solid fa-file fs-1x text-light"></i>
                      Nuevo Cotizacion
                    </Link>                  
                  </div>
                </div>
                <div className="card-body">
                  
                </div>
              </div>
               <MaterialReactTable columns={columns} data={cotizacion}
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