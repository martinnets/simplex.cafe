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
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, LabelList, Label, Text, Cell, ResponsiveContainer, LineChart, PieChart, Pie, BarChart } from "recharts";
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
    {
      id: 1, creador: "Super Admin", proceso: "Proceso v3", tipo: "Fit del puesto",
      inicio: "2025-05-29", fin: "2025-05-31", progreso: "0", estado: "Abierto"
    },
    {
      id: 2, creador: "Admin", proceso: "Proceso v3", tipo: "Fit del puesto",
      inicio: "2025-05-29", fin: "2025-05-31", progreso: "50", estado: "Inactivo"
    },
    {
      id: 3, creador: "Martin alonso", proceso: "Proceso v3", tipo: "Fit del puesto",
      inicio: "2025-05-29", fin: "2025-05-31", progreso: "75", estado: "Abierto"
    },

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
  const databar = [
    { name: 'Línea 1', actual: 85, target: 95 },
    { name: 'Línea 2', actual: 72, target: 80 },
    { name: 'Línea 3', actual: 90, target: 95 },
    { name: 'Línea 4', actual: 65, target: 75 }];
  const datamonth = [
    { month: 'Ene', current: 65, previous: 42 },
    { month: 'Feb', current: 59, previous: 49 },
    { month: 'Mar', current: 80, previous: 60 },
    { month: 'Abr', current: 81, previous: 71 },
    { month: 'May', current: 56, previous: 36 },
    { month: 'Jun', current: 55, previous: 45 },
    { month: 'Jul', current: 72, previous: 60 },
    { month: 'Ago', current: 78, previous: 65 },
    { month: 'Sep', current: 85, previous: 70 },
    { month: 'Oct', current: 90, previous: 75 },
    { month: 'Nov', current: 95, previous: 80 },
    { month: 'Dic', current: 98, previous: 85 }];
  const datakpi = [
    { name: 'Rotación de Inventario', value: 72, color: 'success' },
    { name: 'Tiempo de entrega promedio', value: 85, color: 'info' },
    { name: 'Uso de capacidad de almacén', value: 63, color: 'warning' },
    { name: 'Cumplimiento de pedidos a tiempo', value: 92, color: 'success' }];
  const cardAlmacen = [
    { id: 1, title: "Ingreso", subtitle: "a Almacen", icon: 'fa-solid fa-folder fs-3x', ruta: '/kardexform?tipo=1' },
    { id: 2, title: "Salida", subtitle: "de Almacen", icon: 'fa-solid fa-folder fs-3x', ruta: '/kardexform?tipo=0' },
    { id: 3, title: "Kardex", subtitle: "", icon: 'fa-solid fa-folder fs-3x', ruta: '/kardex' },
  ];
  const datainventario = [
    { name: 'Materia Prima', value: 35 },
    { name: 'Productos en Proceso', value: 25 },
    { name: 'Productos Terminados', value: 30 },
    { name: 'Suministros', value: 10 }];
  const dataorders = [
    { id: '#ORD-2548', customer: 'Empresa ABC', date: '03/05/2025', amount: 5430, status: 'completed' },
    { id: '#ORD-2547', customer: 'Distribuidora XYZ', date: '02/05/2025', amount: 2100, status: 'processing' },
    { id: '#ORD-2546', customer: 'Industrias Méndez', date: '02/05/2025', amount: 8750, status: 'processing' },
    { id: '#ORD-2545', customer: 'Corporación Global', date: '01/05/2025', amount: 3890, status: 'pending' },
    { id: '#ORD-2544', customer: 'Suministros Técnicos', date: '01/05/2025', amount: 1250, status: 'completed' }
  ];
  return (
    <>
      {/* begin::Row */}
      <div className='row g-5 g-xl-8'>
        <div className='col-6 col-lg-3  '>
          <StatisticsWidget5
            className='card-xl-stretch mb-xl-8 text-center bg-dark'
            svgIcon='file-invoice'
            color='body-white'
            iconColor='light'
            title={Math.random().toString().slice(2, 4)}
            description='Ordenes de Compra'
            titleColor='light'
            descriptionColor='light'
          />
        </div>
        <div className='col-6 col-lg-3  '>
          <StatisticsWidget5
            className='card-xl-stretch mb-xl-8 text-center bg-danger'
            svgIcon='door-open'
            color='body-white'
            iconColor='light'
            title={Math.random().toString().slice(2, 4)}
            description='Productos en Inventario'
            titleColor='light'
            descriptionColor='light'
          />
        </div>
        <div className='col-6 col-lg-3 '>
          <StatisticsWidget5
            className='card-xl-stretch mb-xl-8 text-center bg-dark'
            svgIcon='arrows-down-to-people'
            color='body-white'
            iconColor='light'
            title={Math.random().toString().slice(2, 4)}
            description='Pedidos Pendientes'
            titleColor='light'
            descriptionColor='light'
          />
        </div>
        <div className='col-6 col-lg-3 '>
          <StatisticsWidget5
            className='card-xl-stretch mb-xl-8 text-center bg-danger'
            svgIcon='door-closed'
            color='body-white'
            iconColor='light'
            title={Math.random().toString().slice(2, 4)+'%'}
            description='Eficiencia Producción'
            titleColor='light'
            descriptionColor='light'
          />
        </div>

      </div>
      {/* end::Row */}

      {/* begin::Row */}
      <div className="separator separator-dashed my-8"></div>
      <div className='row g-5 g-xl-8'>
        <div className='col-lg-6'>
          <div className="card">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Tendencia de Compras</h5>
                 
              </div>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={datamonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="current"
                      name="Compras 2025"
                      stroke="#0d6efd"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                      fill="#0d6efd"
                    />
                    <Line
                      type="monotone"
                      dataKey="previous"
                      name="Compras 2024"
                      stroke="#6c757d"
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className='col-lg-6'>
          <div className="card">
            <div className="card-header bg-white">
            <div className="d-flex justify-content-between align-items-center">

              <h5 className="mb-0">Distribución de Inventario</h5>
              </div>
            </div>
            <div className="card-body">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={datainventario}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className='col-lg-6'>
        <div className="card">
          <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">

            <h5 className="mb-0">Estado de Producción</h5>
            </div>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={databar}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis 
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                  <Legend />
                  <Bar dataKey="actual" name="Capacidad Utilizada" fill="#0d6efd" />
                  <Bar dataKey="target" name="Objetivo" fill="#adb5bd" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        </div>
        <div className='col-lg-6'>
          <div className="card">
            <div className="card-header bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Estado de Pedidos</h5>
                <div className="dropdown">
                  
                  
                </div>
              </div>
            </div>
            <div className="card-body">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Monto</th>
                   </tr>
                </thead>
                <tbody>
                  {dataorders.map((order, index) => (
                    <tr key={index}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
                      <td>{order.date}</td>
                      <td>${order.amount.toFixed(2)}</td>
                       
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* end::Row */}
      {/* begin::Col */}

      {/* end::Col */}

      {/* end::Row */}

    </>
  )
}