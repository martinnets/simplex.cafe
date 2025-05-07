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
import {
    Bar,
    Doughnut,
    Line,
    Pie,
    Scatter
  } from "react-chartjs-2";
  import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend
  } from "chart.js";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend
  );
 
const stockProductos = {
  labels: ["Electrónica", "Ropa", "Alimentos", "Limpieza"],
  datasets: [
    {
      label: "Stock Disponible",
      data: [120, 90, 200, 50],
      backgroundColor: "#0d6efd",
    },
  ],
};

const ocupacionAlmacen = {
  labels: ["Ocupado", "Disponible"],
  datasets: [
    {
      data: [75, 25],
      backgroundColor: ["#198754", "#6c757d"],
    },
  ],
};

const productosPorCategoria = {
  labels: ["Electrónica", "Ropa", "Alimentos", "Limpieza"],
  datasets: [
    {
      label: "Cantidad de Productos",
      data: [120, 90, 200, 50],
      backgroundColor: ["#0d6efd", "#198754", "#ffc107", "#dc3545"],
    },
  ],
};

const movimientosPorDia = {
  labels: ["Lun", "Mar", "Mié", "Jue", "Vie"],
  datasets: [
    {
      label: "Movimientos",
      data: [10, 20, 15, 25, 30],
      borderColor: "#0d6efd",
      backgroundColor: "rgba(13, 110, 253, 0.2)",
      fill: true,
    },
  ],
};

const dispersionMovimientos = {
  datasets: [
    {
      label: "Movimientos por Día",
      data: [
        { x: 1, y: 10 },
        { x: 2, y: 20 },
        { x: 3, y: 15 },
        { x: 4, y: 25 },
        { x: 5, y: 30 },
      ],
      backgroundColor: "#dc3545",
    },
  ],
};

const kpis = [
  { label: "Productos en Stock", value: "460" },
  { label: "Categorías", value: "4" },
  { label: "Espacio Utilizado", value: "75%" },
  { label: "Movimientos Hoy", value: "25" },
  { label: "Stock Crítico", value: "15" },
  { label: "Órdenes Pendientes", value: "8" },
];

const productosStockAjustar = [
  { nombre: "Televisor LG", stock: 2 },
  { nombre: "Detergente", stock: 3 },
  { nombre: "Polos Adidas", stock: 1 },
  { nombre: "Laptop HP", stock: 4 },
];
export function PanelAlmacenPage() {
  const { currentUser } = useAuth()
  
  useEffect(() => {
     
  }, []);
  return (
    <>
    <div className="container py-4">
      <div className="row g-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="col-md-2">
            <div className="card shadow-sm">
              <div className="card-body">
                <p className="text-muted small mb-1">{kpi.label}</p>
                <h5 className="card-title">{kpi.value}</h5>
              </div>
            </div>
          </div>
        ))}

        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Stock por Categoría</h5>
              <Bar data={stockProductos} />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Ocupación del Almacén</h5>
              <Doughnut data={ocupacionAlmacen} />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Productos por Categoría</h5>
              <Pie data={productosPorCategoria} />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Movimientos por Día</h5>
              <Line data={movimientosPorDia} />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Dispersión de Movimientos</h5>
              <Scatter data={dispersionMovimientos} />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Productos con Stock por Ajustar</h5>
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {productosStockAjustar.map((prod, index) => (
                    <tr key={index} className={prod.stock <= 2 ? 'table-danger' : prod.stock <= 4 ? 'table-warning' : ''}>
                      <td>{prod.nombre}</td>
                      <td>{prod.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}