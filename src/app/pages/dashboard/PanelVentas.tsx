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
    Line,
    Pie
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
  const ventasMensuales = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Ventas ($)",
        data: [12000, 19000, 3000, 5000, 20000, 30000],
        backgroundColor: "#0d6efd",
      },
    ],
  };
  
  const ventasPorCategoria = {
    labels: ["Electrónica", "Ropa", "Alimentos", "Hogar"],
    datasets: [
      {
        data: [30000, 15000, 10000, 8000],
        backgroundColor: ["#0d6efd", "#6f42c1", "#198754", "#ffc107"],
      },
    ],
  };
  
  const kpis = [
    { label: "Ventas Totales", value: "$105,000" },
    { label: "Clientes Nuevos", value: "350" },
    { label: "Ticket Promedio", value: "$300" },
    { label: "Productos Vendidos", value: "1,200" },
  ];  
export function PanelVentasPage() {
  const { currentUser } = useAuth()
  
  useEffect(() => {
     
  }, []);
  return (
    <>
       <div className="container py-4">
      <div className="row g-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="col-md-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <p className="text-muted small mb-1">{kpi.label}</p>
                <h5 className="card-title">{kpi.value}</h5>
              </div>
            </div>
          </div>
        ))}

        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Ventas Mensuales</h5>
              <Bar data={ventasMensuales} />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Ventas por Categoría</h5>
              <Pie data={ventasPorCategoria} />
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Resumen de Ventas</h5>
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Producto</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>01/04/2025</td>
                    <td>Juan Pérez</td>
                    <td>Laptop HP</td>
                    <td>$1,200</td>
                  </tr>
                  <tr>
                    <td>02/04/2025</td>
                    <td>María López</td>
                    <td>Zapatillas Nike</td>
                    <td>$150</td>
                  </tr>
                  <tr>
                    <td>03/04/2025</td>
                    <td>Carlos Díaz</td>
                    <td>Refrigerador LG</td>
                    <td>$800</td>
                  </tr>
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