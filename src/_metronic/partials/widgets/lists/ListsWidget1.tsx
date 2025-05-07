
import { FC, useEffect, useState } from 'react'
import {KTIcon} from '../../../helpers'
import {Dropdown1} from '../../content/dropdown/Dropdown1'
import ingresoDataService from '../../../../_services/ingreso'
type Props = {
  className: string
}

const ListsWidget1: FC<Props> = ({className}) => {
  const [ingreso, setingreso] = useState([]);
  useEffect(() => {
    ingresoDataService.getingresotop()
      .then(response => response.json())
      .then(response => {
        setingreso(response)
      })
      .catch(e => {
        console.log(e);
      });
  }, []);
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold text-gray-900'>Ingresos Recientes</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>Top 5</span>
        </h3>

        <div className='card-toolbar'>
          
        </div>
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body pt-5'>
         
        <div className='d-flex align-items-center mb-7'>
          {/* begin::Symbol */}
          <div className='symbol symbol-50px me-5'>
            <span className='symbol-label bg-light-success'>
              <h2>9955</h2>
            </span>
          </div>
          {/* end::Symbol */}
          {/* begin::Text */}
          <div className='d-flex flex-column'>
            <a href='#' className='text-gray-900 text-hover-primary fs-6 fw-bold'>
              Gastos de Luneas
            </a>
            <span className='text-muted fw-semibold'>Administrativo</span>
          </div>
          {/* end::Text */}
        </div>
        {/* end::Item */}
        {/* begin::Item */}
        <div className='d-flex align-items-center mb-7'>
          {/* begin::Symbol */}
          <div className='symbol symbol-50px me-5'>
            <span className='symbol-label bg-light-warning'>
              <KTIcon iconName='pencil' className='fs-2x text-warning' />
            </span>
          </div>
          {/* end::Symbol */}
          {/* begin::Text */}
          <div className='d-flex flex-column'>
            <a href='#' className='text-gray-900 text-hover-primary fs-6 fw-bold'>
              Concept Design
            </a>
            <span className='text-muted fw-semibold'>Art Director</span>
          </div>
          {/* end::Text */}
        </div>
        {/* end::Item */}
        {/* begin::Item */}
        <div className='d-flex align-items-center mb-7'>
          {/* begin::Symbol */}
          <div className='symbol symbol-50px me-5'>
            <span className='symbol-label bg-light-primary'>
              <KTIcon iconName='message-text-2' className='fs-2x text-primary' />
            </span>
          </div>
          {/* end::Symbol */}
          {/* begin::Text */}
          <div className='d-flex flex-column'>
            <a href='#' className='text-gray-900 text-hover-primary fs-6 fw-bold'>
              Functional Logics
            </a>
            <span className='text-muted fw-semibold'>Lead Developer</span>
          </div>
          {/* end::Text */}
        </div>
        {/* end::Item */}
        {/* begin::Item */}
        <div className='d-flex align-items-center mb-7'>
          {/* begin::Symbol */}
          <div className='symbol symbol-50px me-5'>
            <span className='symbol-label bg-light-danger'>
              <KTIcon iconName='disconnect' className='fs-2x text-danger' />
            </span>
          </div>
          {/* end::Symbol */}
          {/* begin::Text */}
          <div className='d-flex flex-column'>
            <a href='#' className='text-gray-900 text-hover-primary fs-6 fw-bold'>
              Development
            </a>
            <span className='text-muted fw-semibold'>DevOps</span>
          </div>
          {/* end::Text */}
        </div>
        {/* end::Item */}
        {/* begin::Item */}
        <div className='d-flex align-items-center'>
          {/* begin::Symbol */}
          <div className='symbol symbol-50px me-5'>
            <span className='symbol-label bg-light-info'>
              <KTIcon iconName='security-user' className='fs-2x text-info' />
            </span>
          </div>
          {/* end::Symbol */}
          {/* begin::Text */}
          <div className='d-flex flex-column'>
            <a href='#' className='text-gray-900 text-hover-primary fs-6 fw-bold'>
              Testing
            </a>
            <span className='text-muted fw-semibold'>QA Managers</span>
          </div>
          {/* end::Text */}
        </div>
        {/* end::Item */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export {ListsWidget1}
