import { Link } from "react-router-dom";
import ingresoDataService from '../../../_services/ingreso'
import pagoDataService from '../../../_services/pago'
import notaDataService from '../../../_services/nota'
import { useEffect, useLayoutEffect, useState } from "react";
import { Ingreso } from "../../../_models/ingreso";
import { Nota } from "../../../_models/nota";
import moment from "moment";
import { useAuth } from "../../modules/auth";
import { Reporte } from "../../../_models/reporte";
import {    cellKeyboardShortcuts, MaterialReactTable,MRT_AggregationFns,MRT_ColumnDef,useMaterialReactTable} from 'material-react-table';
import {  ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, LabelList,Label,Text, Cell} from "recharts";

export function PanelCRMPage() {
  const { currentUser } = useAuth()
  const [ingreso, setingreso] = useState([]);
  const [nota, setNota] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [reporte, setReporte] = useState<Reporte>({});
  const [kpi, setKpi] = useState([]);
  const [kpipago, setKpiPago] = useState([]);
  const [kpinota, setKpiNota] = useState([]);
  const [ingresomoneda, setIngresoMoneda] = useState([]);
  const [pagomoneda, setPagoMoneda] = useState([]);
  const [moneda, setMoneda] = useState('PEN');
  const [datagrafico, setGrafico] = useState([]);

  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  const COLORS = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58'];
  const totalIngresos = kpi.reduce((acc, row) => acc + row.total, 0);
  const totalPagos = kpi.reduce((acc, row) => acc + row.total, 0);
  const columns_ingreso =
  [
      { id: 'cuenta',header: 'Cuenta',accessorKey: 'cuenta',size:10, 
        Footer: () => <h3 className="fw-bold">Total: {totalIngresos}</h3>,
      },
      { id: 'moneda',header: 'Moneda',accessorKey: 'moneda',size:10},
      { id: 'metodo_pago', header: 'MetodoPago',accessorKey: 'metodo_pago',},
      { id: 'total',header: 'Total',accessorKey: 'total',size:40,        
        AggregatedCell: ({ cell }) => <div>{cell.getValue()}</div>,}, 
  ]
  const columns_pago =
  [
      { id: 'cuenta',header: 'Cuenta',accessorKey: 'cuenta',size:10, 
        Footer: () => <h3 className="fw-bold">Total: {totalPagos}</h3>,
      },
      { id: 'moneda',header: 'Moneda',accessorKey: 'moneda',size:10},
      { id: 'metodo_pago', header: 'MetodoPago',accessorKey: 'metodo_pago',},
      { id: 'total',header: 'Total',accessorKey: 'total',size:40,        
        AggregatedCell: ({ cell }) => <div>{cell.getValue()}</div>,}, 
  ]
  const columns = [
    {
      dataField: '_id', text: 'Acción', formatter: (rowcontent, row: Nota) => {
        let rndInt = randomIntFromInterval(1, 4);
        return (
          <div  >
            {rndInt === 1 ?
              <>
                <i className="fa-solid fa-file-invoice fs-2x text-danger"></i>
              </> :
              <>{rndInt === 2 ?
                <>
                  <i className="fa-solid fa-file-invoice fs-2x text-success"></i>
                </> :
                <>{rndInt === 3 ?
                  <>
                    <i className="fa-solid fa-file-invoice fs-2x text-primary"></i>
                  </> :
                  <>
                    <i className="fa-solid fa-file-invoice fs-2x text-warning"></i>
                  </>}
                </>}
              </>}
          </div>
        )
      }
    },
    {
      dataField: 'codigo_estado', text: 'Estado', sort: true, formatter: (rowcontent, row: Nota) => {
        return (
          <>
            {row.codigo_estado === '1' ?
              <>
                <span className='badge  badge-warning'>Preparada</span>
              </> :
              <>
                {row.codigo_estado === '2' ?
                  <>
                    <span className='badge  badge-primary'>Cobrado</span>
                  </> :
                  <>
                    {row.codigo_estado == '3' ?
                      <>
                        <span className='badge  badge-danger'>Pendiente</span>
                      </> :
                      <>
                        <span className='badge  badge-info'>Anulada</span>
                      </>}
                  </>}
              </>}
          </>
        )
      }
    },
    { dataField: 'nota', text: 'Nota', sort: true },
    { dataField: 'fecha', text: 'Fecha', sort: true, formatter: (rowcontent, row) => `${moment(row.fec_crea).format('DD-MM-yyyy')}` },
    { dataField: 'cliente', text: 'Cliente', sort: true, formatter: (rowcontent, row) => `${row.cliente[0].cliente}` },
    { dataField: 'usu_crea', text: 'Teléfono', sort: true, formatter: (rowcontent, row) => `${row.cliente[0].telefono}` },
    { dataField: 'vendedor', text: 'Vendedor', sort: true, formatter: (rowcontent, row) => `${row.personal[0].personal}` },
    { dataField: 'total', text: 'Total', align: 'right', sort: true, formatter: (rowcontent, row) => <h2>{row.total}</h2> },
    { dataField: 'porcobrar', text: 'Pendiente', align: 'right', sort: true, formatter: rowcontent => <h2 className="text-danger" >{rowcontent}</h2> },
    {
      dataField: 'cobrado', text: 'Cobrado', align: 'right', sort: true, formatter: (rowcontent, row: Nota) => {
        return (
          <><h2 >{row.cobrado}</h2></>
        )
      }
    },
    { dataField: 'moneda', text: 'Moneda', sort: true },
    { dataField: 'referencia', text: 'Referencia', sort: true },
  ];
  const handlePanel = async (e) => {
    e.preventDefault();
    console.log(e.target.value)
    console.log(e.target.name)
    if (e.target.name==='moneda'){
      console.log('mon')
      reporte.moneda= e.target.value
      //setMoneda(e.target.value)
    }else {
      const fecha = new Date();
      switch (e.target.value) {
        case "dia":
          reporte.fec_crea =moment().format('yyyy-M-DD')
          reporte.fec_modi = moment().format('yyyy-M-DD')
          setFiltro("dia")
          break;
        case "sem":
          reporte.fec_crea = moment().add(-7, 'd').format('yyyy-M-DD')
          reporte.fec_modi = moment().format('yyyy-M-DD')
          setFiltro("sem")
          break;
        case "mes":
          reporte.fec_crea = moment().add(-30, 'd').format('yyyy-M-DD')
          reporte.fec_modi = moment().format('yyyy-M-DD')
          setFiltro("mes")
          break;
      }
    }
    reporte.empresaId=currentUser?.empresa[0]._id
    //reporte.moneda=moneda
    console.log(reporte)
    console.log(moneda)
    //reporte.empresaId=currentUser?.empresa[0]._id
    ingresoDataService.getingresokpi(reporte)
      .then(function (response) {
        setKpi(response.data)
        console.log(response.data)
      })
    pagoDataService.getpagokpi(reporte)
      .then(function (response) {
        setKpiPago(response.data)
        console.log(response.data)
      })
  }
  useEffect(() => {
    
    setFiltro("dia")
    const fecha = new Date();
    //console.log(fecha)
    reporte.fec_crea = moment().format('yyyy-M-DD')
    reporte.fec_modi = moment().format('yyyy-M-DD')
    reporte.empresaId=currentUser?.empresa[0]._id
    reporte.moneda='PEN'
    console.log(reporte)
    ingresoDataService.getingresokpi(reporte)
      .then(function (response) {
        setKpi(response.data)
        //console.log(response)
        //console.log(ingresomoneda)
    })   
    // //console.log(reporte)
    pagoDataService.getpagokpi(reporte)
      .then(function (response) {
        setKpiPago(response.data)
        console.log(response.data)
      })

    // ingresoDataService.getingresotop(currentUser?.empresa[0]._id)
    //   .then(response => response.json())
    //   .then(response => {
    //     setingreso(response)
    //     //console.log(response)
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   });
    // notaDataService.getnotatop(currentUser?.empresa[0]._id)
    //   .then(response => response.json())
    //   .then(response => {
    //     setNota(response)
    //     //console.log(response)
    //   })
    //   .catch(e => {
    //     console.log(e);
    //   });
  }, []);
  return (
    <>
      <div className='app-toolbar py-3 py-lg-6' id='kt_app_toolbar'>
        <div id='kt_app_toolbar_container'
          className='app-container d-flex flex-stack'>
          <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
            Panel de Control</h1>
          <div className='d-flex align-items-center py-1'>
            <div className='me-4'>
            </div>

          </div>
        </div>
      </div>
      <div className="card card-flush">
        <div className="card-header pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold text-gray-900">Resumen </span>
            <span className="text-gray-500 mt-1 fw-semibold fs-6">Puede hacer click para ver detalle</span>
          </h3>
          <div className="card-toolbar">
            <select className="form-control form-control-sm" onChange={(e) => handlePanel(e)}
              name="moneda"    >
              <option value="PEN">PEN</option>
              <option value="USD">USD</option>
            </select>
            <select className="form-control form-control-sm" onChange={(e) => handlePanel(e)}
              name="filtro"   >
              <option value="dia">Dia</option>
              <option value="sem">Semana</option>
              <option value="mes">Mes</option>
            </select>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-xl-3">          
          <Link to={"/lead"}
            className="btn btn-outline btn-outline-dashed btn-light-success d-flex flex-stack text-start p-6 mb-5">
            <div className="d-flex align-items-center me-2">
              <div className="form-check form-check-custom form-check-solid form-check-success me-6">
                <i className="fa-solid fa-user-tag fs-3x"></i>
              </div>
              <div className="flex-grow-2">
              <span className="d-flex align-items-center fs-3 fw-bold flex-wrap hover:text-light">
                Leads
                </span>
                <div className="fw-semibold opacity-50">
                Total
                </div>
              </div>
            </div>
            <div className="ms-5">
              <span className="mb-2"></span>
              <span className="fs-2x fw-bold">
              {kpi.reduce((acc, pilot) => acc + Number(pilot.total), 0)}
              </span>
              <span className="fs-7 opacity-50">/
                <span data-kt-element="period">{filtro}</span>
              </span>
            </div>
          </Link>
        </div>
        <div className="col-xl-3">          
          <Link to={"/cliente"}
            className="btn btn-outline btn-outline-dashed btn-light-primary d-flex flex-stack text-start p-6 mb-5">
            <div className="d-flex align-items-center me-2">
              <div className="form-check form-check-custom form-check-solid form-check-primary me-6">
                <i className="fa-solid fa-user fs-3x"></i>
              </div>
              <div className="flex-grow-2">
              <span className="d-flex align-items-center fs-3 fw-bold flex-wrap hover:text-light">
                Clientes
                </span>
                <div className="fw-semibold opacity-50">
                Total
                </div>
              </div>
            </div>
            <div className="ms-5">
              <span className="mb-2"></span>
              <span className="fs-2x fw-bold">
              {kpi.reduce((acc, pilot) => acc + Number(pilot.total), 0)}
              </span>
              <span className="fs-7 opacity-50">/
                <span data-kt-element="period">{filtro}</span>
              </span>
            </div>
          </Link>
        </div>
        <div className="col-xl-3">          
          <Link to={"/oportunidad"}
            className="btn btn-outline btn-outline-dashed btn-light-info d-flex flex-stack text-start p-6 mb-5">
            <div className="d-flex align-items-center me-2">
              <div className="form-check form-check-custom form-check-solid form-check-warning me-6">
                <i className="fa-solid fa-comments-dollar fs-3x"></i>
              </div>
              <div className="flex-grow-2">
              <span className="d-flex align-items-center fs-3 fw-bold flex-wrap hover:text-light">
              Oportunidad
                </span>
                <div className="fw-semibold opacity-50">
                {reporte.moneda}
                </div>
              </div>
            </div>
            <div className="ms-5">
              <span className="mb-2"></span>
              <span className="fs-2x fw-bold">
              {kpi.reduce((acc, pilot) => acc + Number(pilot.total), 0)}
              </span>
              <span className="fs-7 opacity-50">/
                <span data-kt-element="period">{filtro}</span>
              </span>
            </div>
          </Link>
        </div>
        <div className="col-xl-3">          
          <Link to={"/venta"}
            className="btn btn-outline btn-outline-dashed btn-light-danger d-flex flex-stack text-start p-6 mb-5">
            <div className="d-flex align-items-center me-2">
              <div className="form-check form-check-custom form-check-solid form-check-danger me-6">
                <i className="fa-solid fa-money-check-dollar fs-3x"></i>
              </div>
              <div className="flex-grow-2">
              <span className="d-flex align-items-center fs-3 fw-bold flex-wrap hover:text-light">
              Ventas
                </span>
                <div className="fw-semibold opacity-50">
                {reporte.moneda}
                </div>
              </div>
            </div>
            <div className="ms-5">
              <span className="mb-2"></span>
              <span className="fs-2x fw-bold">
              {kpi.reduce((acc, pilot) => acc + Number(pilot.total), 0)}
              </span>
              <span className="fs-7 opacity-50">/
                <span data-kt-element="period">{filtro}</span>
              </span>
            </div>
          </Link>
        </div>
          
      </div>     
      <div className="row">
        <div className='col-lg-6'>
          <MaterialReactTable columns={columns_ingreso} data={kpi}
            enableGrouping= {true}
            enableTopToolbar={ false}
            initialState={{
              grouping:['cuenta','moneda'],                                   
              density: 'compact',
              expanded: true, //expand all groups by default
            }}
          />
          <ComposedChart
            layout="vertical"
            width={400}
            height={300}
            data={kpi}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="metodopago" type="category" fontSize={9} />
            <Tooltip />
            <Bar dataKey="total" barSize={20} fill='rgba(237, 28, 35, 1)'
              label={{ fill: "#000", position: 'bottom' }} color="#000" >
                {kpi.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Bar>
          </ComposedChart>
        </div>
        <div className='col-lg-6'>
          <MaterialReactTable columns={columns_pago} data={kpipago}
            enableGrouping= {true}
            enableTopToolbar={ false}
            initialState={{
              grouping:['cuenta','moneda'],                                    
              density: 'compact',
              expanded: true, //expand all groups by default
            }}
          />
          <ComposedChart
            layout="vertical"
            width={400}
            height={300}
            data={kpipago}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="metodopago" type="category" fontSize={9} />
            <Tooltip />
            <Bar dataKey="total" barSize={20} fill='rgba(237, 28, 35, 1)'
              label={{ fill: "#000", position: 'bottom' }} color="#000" >
                {kpi.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Bar>
          </ComposedChart>
        </div>
      </div>
    </>
  )
}