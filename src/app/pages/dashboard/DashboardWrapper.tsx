import {useIntl} from 'react-intl'
import {PageTitle} from '../../../_metronic/layout/core'
import {
  ListsWidget1,
  TablesWidget5,
} from '../../../_metronic/partials/widgets'
import { Link } from 'react-router-dom'
import ingresoDataService from '../../../_services/ingreso'
import { useEffect, useState } from 'react'
import { useAuth } from '../../modules/auth'

const [ingreso, setingreso] = useState([]);

const DashboardPage = () => (
  <>
    {/* begin::Row */}
    <div className='row g-5 g-xl-8'>
      <div className='col-xl-3'>
      <Link to={"/pedido"}
          className="bg-primary card hover-elevate-up shadow-sm parent-hover h-110px border
             border-dotted border-primary border-active active m-2">
          <div className="card-body d-flex align-items ">
            <i className="fa-solid fa-file-invoice fs-3x text-light"></i>
            <div className="bullet bg-light h-35px w-1px mx-2"> </div>
            <div className="separator my-3"></div>
            <ul className="list-unstyled">
              <li>
                <span className="text-secondary pt-1 fw-semibold fs-7">Listado</span>
              </li>
              <li>
                <h3 className="text-light fs-1hx  ">
                Pedidos
                </h3>
              </li>
            </ul>
          </div>
        </Link> 
      </div>

      <div className='col-xl-3'>
      <Link to={"/producto"}
          className="bg-warning card hover-elevate-up shadow-sm parent-hover h-110px border
             border-dotted border-warning border-active active m-2">
          <div className="card-body d-flex align-items ">
            
            <i className="fa-solid fa-money-check-dollar fs-3x text-light"></i>
            <div className="bullet bg-light h-35px w-1px mx-2"> </div>
            <div className="separator my-3"></div>
            <ul className="list-unstyled">
              <li>
                <span className="text-secondary pt-1 fw-semibold fs-7">Listado de</span>
              </li>
              <li>
                <h3 className="text-light fs-1hx  ">
                Ventas
                </h3>
              </li>
            </ul>
          </div>
        </Link>
      </div>

      <div className='col-xl-3'>
      <Link to={"/gasto"}
          className="bg-danger card hover-elevate-up shadow-sm parent-hover h-110px border
             border-dotted border-danger border-active active m-2">
          <div className="card-body d-flex align-items ">
            <i className="fa-brands fa-shopify fs-3x text-light"></i>
            <div className="bullet bg-light h-35px w-1px mx-2"> </div>
            <div className="separator my-3"></div>
            <ul className="list-unstyled">
              <li>
                <span className="text-secondary pt-1 fw-semibold fs-7">Resumen</span>
              </li>
              <li>
                <h3 className="text-light fs-1hx  ">
                Gastos
                </h3>
              </li>
            </ul>
          </div>
        </Link>
      </div>
      <div className='col-xl-3'>
      <Link to={"/ingreso"}
          className="bg-success card hover-elevate-up shadow-sm parent-hover h-110px border
             border-dotted border-success border-active active m-2">
          <div className="card-body d-flex align-items ">
            <i className="fa-brands fa-shopify fs-3x text-light"></i>
            <div className="bullet bg-light h-35px w-1px mx-2"> </div>
            <div className="separator my-3"></div>
            <ul className="list-unstyled">
              <li>
                <span className="text-secondary pt-1 fw-semibold fs-7">Resumen</span>
              </li>
              <li>
                <h3 className="text-light fs-1hx  ">
                Ingresos
                </h3>
              </li>
            </ul>
          </div>
        </Link>
      </div>
    </div>
    {/* end::Row */}

    {/* begin::Row */}
    <div className='row g-5 g-xl-8'>
      {/* begin::Col */}
      <div className='col-xl-4'>
         
      </div>
      {/* end::Col */}

      {/* begin::Col */}
      <div className='col-xl-8'>
        <TablesWidget5 className='card-xl-stretch mb-5 mb-xl-8' />
      </div>
      {/* end::Col */}
    </div>
    {/* end::Row */}

     

    
 
  </>
)

const DashboardWrapper = () => {
  const { currentUser } = useAuth()

  const intl = useIntl()
  useEffect(() => {
    ingresoDataService.getingresotop(currentUser?.empresa[0]._id)
      .then(response => response.json())
      .then(response => {
        setingreso(response)
        
      })
      .catch(e => {
        console.log(e);
      });
  }, []);
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.DASHBOARD'})}</PageTitle>
      <DashboardPage />
    </>
  )
}

export {DashboardWrapper}
