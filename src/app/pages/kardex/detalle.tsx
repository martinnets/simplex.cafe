
import React, { Component, useState, useEffect, useCallback } from "react";
import { useAuth } from "../../modules/auth";
import { Link } from "react-router-dom";
import kardexDataService from "../../../_services/kardex";
 import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import moment from "moment";
import DataTable from 'react-data-table-component';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { DDLAlmacen } from "../../../_metronic/layout/components/select/almacen";

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

const FilterComponent = ({ filterText, onFilter, onClear }) => (
	<>
		<TextField
			id="search"
			type="text"
			placeholder="Filtro por Producto"
			aria-label="Search Input"
			value={filterText}
			onChange={onFilter}
		/>
		<Button type="button" onClick={onClear}>
			X
		</Button>
	</>
);

const columns = [
	{		name: 'Producto', width:"40rem",		selector: row => row.producto,		sortable: true,	},
  {		name: 'Almacen',		selector: row => row.almacen,		sortable: true,	},
  {		name: 'Tipo',		selector: row => row.tipo_ubicacion,		sortable: true,	},
  {		name: 'Ubicacion',		selector: row => row.ubicacion,		sortable: true,	},
	{		name: 'Ingreso',		selector: row => row.sumingreso,		sortable: true,	},
	{		name: 'Salida',		selector: row => row.sumsalida,		sortable: true,	},
  {		name: 'Stock',		sortable: true,	
    cell: row=>{ 
      return (
              <>{row.sumingreso>row.sumsalida?
              <><span className='badge  badge-success' >{row.sumingreso-row.sumsalida}</span>
              </>:
              <><span className='badge  badge-danger' >{row.sumingreso-row.sumsalida}</span>
              </>}
              </>  
            )
    }
  },
];
// const columns = [
  
//   { dataField: 'producto',    text: 'Producto' ,sort:true,formatter: (rowcontent,row) => `${rowcontent}`  },
//   { dataField: 'descripcion',    text: 'Descripcion' ,sort:true,formatter: (rowcontent,row) => `${rowcontent}`  },
//   { dataField: 'almacen',    text: 'Almacen' ,sort:true,formatter: (rowcontent,row) => `${rowcontent}`  },
//   { dataField: 'tipo_ubicacion',    text: 'Tipo Ubicacion' ,sort:true,formatter: (rowcontent,row) => `${rowcontent}`  },
//   { dataField: 'ubicacion',    text: 'Ubicacion' ,sort:true,formatter: (rowcontent,row) => `${rowcontent}`  },  
//   { dataField: 'sumingreso',    text: 'Ingreso',align:'right' ,sort:true,formatter: (rowcontent,row) => <h2>{row.sumingreso}</h2>  }, 
//   { dataField: 'sumsalida',    text: 'Salida',align:'right' ,sort:true,formatter: (rowcontent,row) => <h2>{row.sumsalida}</h2>  }, 
//   { dataField: 'productoid',    text: 'Saldo',align:'right' ,sort:true,formatter: (rowcontent,row) => {
//     return (
//       <>{row.sumingreso>row.sumsalida?
//       <><span className='badge  badge-success' >{row.sumingreso-row.sumsalida}</span>
//       </>:
//       <><span className='badge  badge-danger' >{row.sumingreso-row.sumsalida}</span>
//       </>}
//       </>  
//     )
//   }}, 
// ];
  
export function KardexDetallePage() {
  const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
	
  const { currentUser } = useAuth()
  const [ingreso, setingreso] = useState([]);
  const filteredItems = ingreso.filter(
		item => item.producto && item.producto.toLowerCase().includes(filterText.toLowerCase()),
	);
  const exportToCSV = (csvData, fileName) => {
    const ddlreporte = [];
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], {type: fileType});
        FileSaver.saveAs(data, fileName + fileExtension);
    }
  const subHeaderComponentMemo = React.useMemo(() => {
      const handleClear = () => {
        if (filterText) {
          setResetPaginationToggle(!resetPaginationToggle);
          setFilterText('');
        }
      };
  
      return (
        <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
      );
    }, [filterText, resetPaginationToggle]);    
    const handleReporte = async (e) => {
      e.preventDefault();
      
  }
    useEffect(() => {
        kardexDataService.getkardexstock(currentUser?.empresa[0]._id)
          .then(response => response.json())
          .then(response => {
            setingreso(response)
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
                  <h3 className="card-title  text-light">Inventario Stock</h3>
                  <div className="card-toolbar">
                           
                    <button  className="btn btn-success btn-sm"
                    onClick={(e) => exportToCSV(ingreso,'Inventario')}>
                    <i className="fa-solid fa-file-excel "></i>Exportar</button>
                  </div>
                </div>
                <div className="card-body">
                   
                  <DataTable
                    
                    columns={columns}
                    data={filteredItems}
                    pagination
                    paginationResetDefaultPage={resetPaginationToggle} 
                    // optionally, a hook to reset pagination to page 1
                    subHeader
			              subHeaderComponent={subHeaderComponentMemo}
                  />
   
                </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
} 