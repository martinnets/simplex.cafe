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
import { cellKeyboardShortcuts, MaterialReactTable, MRT_AggregationFns, MRT_ColumnDef, useMaterialReactTable } from 'material-react-table';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, LabelList, Label, Text, Cell } from "recharts";
import { StatisticsWidget5 } from "../../../_metronic/partials/widgets";

export function PanelPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<typeof exampleData>([]);

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
  const columns = [
  
    { id: 'creador', header: 'Creador', sortable: true },
    { id: 'proceso', header: 'Proceso', sortable: true },
    { id: 'tipo', header: 'Tipo', sortable: true },
    { id: 'inicio', header: 'Inicio', sortable: true },
    { id: 'fin', header: 'Fin', sortable: true },
    { id: 'progreso', header: 'Progreso', sortable: true },
    { id: 'estado', header: 'Estado', sortable: true },
    
  ];
  const exampleData = [
    { id: 1, creador: "Super Admin", proceso: "Proceso v3", tipo: "Fit del puesto", 
      inicio: "2025-05-29",fin:"2025-05-31", progreso: "0", estado: "Abierto" },
    { id: 2, creador: "Admin", proceso: "Proceso v3", tipo: "Fit del puesto", 
      inicio: "2025-05-29",fin:"2025-05-31", progreso: "50", estado: "Inactivo" },
    { id: 3, creador: "Martin alonso", proceso: "Proceso v3", tipo: "Fit del puesto", 
      inicio: "2025-05-29",fin:"2025-05-31", progreso: "75", estado: "Abierto" },
    
  ];
  
  function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  const COLORS = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58'];
  const totalIngresos = kpi.reduce((acc, row) => acc + row.total, 0);
  const totalPagos = kpi.reduce((acc, row) => acc + row.total, 0);
  const columns_ingreso =
    [
      {
        id: 'cuenta', header: 'Cuenta', accessorKey: 'cuenta', size: 10,
        Footer: () => <h3 className="fw-bold">Total: {totalIngresos}</h3>,
      },
      { id: 'moneda', header: 'Moneda', accessorKey: 'moneda', size: 10 },
      { id: 'metodo_pago', header: 'MetodoPago', accessorKey: 'metodo_pago', },
      {
        id: 'total', header: 'Total', accessorKey: 'total', size: 40,
        AggregatedCell: ({ cell }) => <div>{cell.getValue()}</div>,
      },
    ]
  const columns_pago =
    [
      {
        id: 'cuenta', header: 'Cuenta', accessorKey: 'cuenta', size: 10,
        Footer: () => <h3 className="fw-bold">Total: {totalPagos}</h3>,
      },
      { id: 'moneda', header: 'Moneda', accessorKey: 'moneda', size: 10 },
      { id: 'metodo_pago', header: 'MetodoPago', accessorKey: 'metodo_pago', },
      {
        id: 'total', header: 'Total', accessorKey: 'total', size: 40,
        AggregatedCell: ({ cell }) => <div>{cell.getValue()}</div>,
      },
    ]
  const columns2 = [
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
    if (e.target.name === 'moneda') {
      console.log('mon')
      reporte.moneda = e.target.value
      //setMoneda(e.target.value)
    } else {
      const fecha = new Date();
      switch (e.target.value) {
        case "dia":
          reporte.fec_crea = moment().format('yyyy-M-DD')
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
    reporte.empresaId = currentUser?.empresa[0]._id
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
    reporte.empresaId = currentUser?.empresa[0]._id
    reporte.moneda = 'PEN'
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
    const loadExampleData = () => {
      setLoading(true);


      setData(exampleData);
      setLoading(false);
    };

    loadExampleData();
  }, []);
  const cardVentas = [
    { id: 1, title: "Nota",subtitle:"de Ventas", icon: 'fa-solid fa-user-tag fs-3x', ruta: '/nota' },
    { id: 2, title: "Venta",subtitle:" Factura/Boleta", icon: 'fa-solid fa-user-tag fs-3x', ruta: '/venta' },
    { id: 3, title: "Pedido",subtitle:"de Venta", icon: 'fa-solid fa-user-tag fs-3x', ruta: '/pedido' },
    { id: 4, title: "Cotizacion",subtitle:"a Cliente", icon: 'fa-solid fa-user-tag fs-3x', ruta: '/cotizacion' },
  ];
  const cardFinanzas = [
    { id: 1, title: "Ingreso",subtitle:"de Dinero", icon: 'fa-solid fa-file-invoice-dollar fs-3x', ruta: '/ingreso' },
    { id: 2, title: "Pago",subtitle:"Estandar", icon: 'fa-solid fa-file-invoice-dollar fs-3x', ruta: '/pago' },
    { id: 3, title: "Pago",subtitle:"Pendiente", icon: 'fa-solid fa-file-invoice-dollar fs-3x', ruta: '/pagopendiente' },
    { id: 4, title: "Pago",subtitle:"Programado", icon: 'fa-solid fa-file-invoice-dollar fs-3x', ruta: '/pagoprog' },
  ];
  const cardCompras = [
    { id: 1, title: "Orden",subtitle:"de Compra", icon: 'fa-solid fa-money-bill-1 fs-3x', ruta: '/orden' },
    { id: 2, title: "Factura",subtitle:"de Compra", icon: 'fa-solid fa-money-bill-1 fs-3x', ruta: '/compra' },
  ];
  const cardAlmacen = [
    { id: 1, title: "Ingreso",subtitle:"a Almacen", icon: 'fa-solid fa-folder fs-3x', ruta: '/kardexform?tipo=1' },
    { id: 2, title: "Salida",subtitle:"de Almacen", icon: 'fa-solid fa-folder fs-3x', ruta: '/kardexform?tipo=0' },
    { id: 3, title: "Kardex",subtitle:"", icon: 'fa-solid fa-folder fs-3x', ruta: '/kardex' },    
  ];
  const cardComercial = [
    { id: 1, title: "Lead",subtitle:"o Contácto", icon: 'fa-solid fa-paper-plane fs-3x', ruta: '/lead' },
    { id: 2, title: "Oportunidad",subtitle:"de Venta", icon: 'fa-solid fa-paper-plane fs-3x', ruta: '/oportunidad' },
    { id: 3, title: "Accion",subtitle:"Comercial", icon: 'fa-solid fa-paper-plane fs-3x', ruta: '/accion' },    
  ];
  return (
    <>
        {/* begin::Row */}
        <div className='row g-5 g-xl-8'>
          <div className='col-6 col-lg-2  '>
            <StatisticsWidget5
              className='card-xl-stretch mb-xl-8 text-center'
              svgIcon='file-invoice'
              color='body-white'
              iconColor='info'
              title={Math.random().toString().slice(2, 4)}
              description='Procesos'
              titleColor='gray'
              descriptionColor='gray-400'
            />
          </div>
          <div className='col-6 col-lg-2 mb-4'>
            <StatisticsWidget5
              className='card-xl-stretch mb-xl-8 text-center'
              svgIcon='door-open'
              color='body-white'
              iconColor='primary'
              title={Math.random().toString().slice(2, 4)}
              description='Abiertos'
              titleColor='primary'
              descriptionColor='gray-400'
            />
          </div>
          <div className='col-6 col-lg-2 '>
            <StatisticsWidget5
              className='card-xl-stretch mb-xl-8 text-center'
              svgIcon='arrows-down-to-people'
              color='body-white'
              iconColor='danger'
              title={Math.random().toString().slice(2, 4)}
              description='Inactivos'
              titleColor='danger'
              descriptionColor='gray-400'
            />
          </div>
          <div className='col-6 col-lg-2 '>
            <StatisticsWidget5
              className='card-xl-stretch mb-xl-8 text-center'
              svgIcon='door-closed'
              color='body-white'
              iconColor='success'
              title={Math.random().toString().slice(2, 4)}
              description='Cerrados'
              titleColor='success'
              descriptionColor='gray-400'
            />
          </div>
          <div className='col-6 col-lg-2 '>
            <StatisticsWidget5
              className='card-xl-stretch mb-xl-8 text-center'
              svgIcon='people-group'
              color='body-white'
              iconColor='info'
              title={Math.random().toString().slice(2, 4)}
              description='Evaluado'
              titleColor='info'
              descriptionColor='gray-400'
            />
          </div>
          <div className='col-6 col-lg-2 '>
            <StatisticsWidget5
              className='card-xl-stretch mb-xl-8 text-center'
              svgIcon='elevator'
              color='body-white'
              iconColor='warning'
              title={Math.random().toString().slice(2, 4)}
              description='Creditos'
              titleColor='warning'
              descriptionColor='gray-400'
            />
          </div>
        </div>
        {/* end::Row */}

        {/* begin::Row */}
        <div className='row g-5 g-xl-8'>
          <div className="card card-strech">
            <form className="form">
              <div className="card-body">
                <div className="form-group row">
                  <div className="col-lg-2">
                    <input type="email" className="form-control" placeholder="Enter full name"></input>
                  </div>
                  <div className="col-lg-2">
                    <input type="email" className="form-control" placeholder="Enter contact number"></input>
                  </div>
                  <div className="col-lg-2">
                    <select className="form-select  " name="timeZone"  >
                      <option value="">Organizacion..</option>
                      <option value="International Date Line West">Unod</option>
                      <option value="Midway Island">Dos</option>
                      <option value="Samoa">Tres</option>
                    </select>
                  </div>
                  <div className="col-lg-2">
                    <select className="form-select  " name="timeZone"  >
                      <option value="">Creador..</option>
                      <option value="International Date Line West">Unod</option>
                      <option value="Midway Island">Dos</option>
                      <option value="Samoa">Tres</option>
                    </select>
                  </div>
                  <div className="col-lg-2">
                    <select className="form-select  " name="timeZone"  >
                      <option value="">Estado..</option>
                      <option value="International Date Line West">Unod</option>
                      <option value="Midway Island">Dos</option>
                      <option value="Samoa">Tres</option>
                    </select>
                  </div>
                  <div className="col-lg-2">
                    <select className="form-select  " name="timeZone"  >
                      <option value="">Nivel Jerarquico..</option>
                      <option value="International Date Line West">Unod</option>
                      <option value="Midway Island">Dos</option>
                      <option value="Samoa">Tres</option>
                    </select>
                  </div>
                </div>
                <div className='col-xl-12 pt-5'>
            <div className="table-responsive">
            
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>

                    {columns.map(column => (
                      <th
                        key={column.id}
                        className="border-0 bg-success text-white py-2 px-2"
                      >
                        <div
                          className="d-flex align-items-center"
                          style={{ cursor: column.sortable ? 'pointer' : 'default' }}

                        >
                          {column.header}

                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      </td>
                    </tr>
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="text-center py-4 text-muted">
                        No se encontraron datos
                      </td>
                    </tr>
                  ) : (
                    data.map(row => (
                      <tr key={row.id} >
                        {columns.map(column => (
                          <td key={`${row.id}-${column.id}`}>
                            {column.id === 'progreso' ? 
                            <>
                            <div className="progress">
                                <div className="progress-bar bg-secondary text-info" role="progressbar" 
                                style={{ width: row[column.id as keyof typeof row]+'%' }} aria-valuenow={75}
                                aria-valuemin={0} aria-valuemax={100}>
                                 {row[column.id as keyof typeof row]}%
                                </div>
                            </div>
                            </>
                            :<>
                              {row[column.id as keyof typeof row] === 'Abierto' ? (
                                <>
                                <span className='badge badge-info'>Abierto</span>
                                </>
                              ) : (
                                <>
                                {row[column.id as keyof typeof row] === 'Inactivo' ? (
                                  <>
                                  <span className='badge badge-danger'>Inactivo</span></>
                                ) : (
                                  <>{row[column.id as keyof typeof row]}</>
                                )}
                                </>
                              )}
                            </>}
                            
                            </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
              </div>
            </form>
          </div>
         
          {/* begin::Col */}
          <div className='col-xl-12'>
           
           </div>
          {/* end::Col */}
        </div>
        {/* end::Row */}
    </>
  )
}