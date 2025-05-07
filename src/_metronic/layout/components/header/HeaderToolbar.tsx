/* eslint-disable @typescript-eslint/no-explicit-any */

import {useEffect, useState} from 'react'
import noUiSlider, {target} from 'nouislider'
import {useLayout} from '../../core'
import {KTIcon} from '../../../helpers'
import {DefaultTitle} from './page-title/DefaultTitle'
import {ThemeModeSwitcher} from '../../../partials'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../app/modules/auth'
import { Container, Dropdown, Nav, Navbar, NavDropdown } from 'react-bootstrap'

const HeaderToolbar = () => {
  const {currentUser, logout} = useAuth()
  const navigate = useNavigate();
  const {classes} = useLayout()
  const [status, setStatus] = useState<string>('1')
  const handleChange = (e) => {
    console.log(e.target.value)
    navigate("/"+ e.target.value)    
  };
  useEffect(() => {
    const slider: target = document.querySelector('#kt_toolbar_slider') as target
    const rangeSliderValueElement: Element | null = document.querySelector(
      '#kt_toolbar_slider_value'
    )

    if (!slider) {
      return
    }

    slider.innerHTML = ''

    noUiSlider.create(slider, {
      start: [5],
      connect: [true, false],
      step: 1,
      range: {
        min: [1],
        max: [10],
      },
    })

    slider.noUiSlider?.on('update', function (values: any, handle: any) {
      if (!rangeSliderValueElement) {
        return
      }

      rangeSliderValueElement.innerHTML = parseInt(values[handle]).toFixed(1)
    })
  }, [])

  return (
    <div className='toolbar d-flex align-items-stretch'>
      {/* begin::Toolbar container */}
      <div
        className={`${classes.headerContainer.join(
          ' '
        )} py-6 py-lg-0 d-flex flex-column flex-lg-row align-items-lg-stretch justify-content-lg-between`}
      >
       <div className="page-title d-flex justify-content-center flex-column me-5">
          <Link to={"/"} className='d-flex flex-column text-gray-900 fw-bolder fs-3 mb-0 '>
            Inicio
          </Link>
          
        </div>
        <div className='d-flex align-items-stretch   pt-3 pt-lg-0'>
          {/* begin::Action wrapper */}
          <div className='d-flex align-items-center'>
            {/* begin::Label */}
            {/* end::Label */}

            {/* begin::Select */}
{/*             
            <Dropdown >
              <Dropdown.Toggle variant="primary sm" id="dropdown-basic">
                Acceso Directo
              </Dropdown.Toggle>

              <Dropdown.Menu >
                <Dropdown.Item href="/ventaform">Nueva Venta</Dropdown.Item>
                <Dropdown.Item href="/cotizacionform">Nueva Cotizacion</Dropdown.Item>
                <Dropdown.Item href="/">Nuevo Ingreso ($)</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Nuevo Pago($)</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
               
            {/* end::Select  */}
          </div>
          {/* end::Action wrapper */}

          {/* begin::Action wrapper */}
          <div className='d-flex align-items-center'>
            {/* begin::Separartor */}
            <div className='bullet bg-secondary h-35px w-1px mx-5'></div>
            {/* end::Separartor */}

            {/* begin::Label */}
            <span className='fs-7 text-gray-700 fw-bold d-none d-sm-block'>
              
              
            </span>
            {/* end::Label */}

            {/* begin::NoUiSlider */}
            <div className='d-flex align-items-center ps-4' id='kt_toolbar'>
            </div>
            {/* end::NoUiSlider */}

            {/* begin::Separartor */}
            <div className='bullet bg-secondary h-35px w-1px mx-5'></div>
            {/* end::Separartor */}
          </div>
          {/* end::Action wrapper */}

          {/* begin::Action wrapper */}
          <div className='d-flex align-items-center'>
            
            <div className='d-flex'>
              {/* begin::Action */}
             
              <a
                href='#'
                className='btn btn-sm btn-icon btn-icon-muted btn-active-icon-primary'
                data-bs-toggle='modal'
                data-bs-target='#kt_modal_invite_friends'
              >
                <KTIcon iconName='files' className='fs-1' />
              </a>
              {/* end::Action */}

              {/* begin::Notifications */}
              <div className='d-flex align-items-center'>
                {/* begin::Menu- wrapper */}
                <a href='#' className='btn btn-sm btn-icon btn-icon-muted btn-active-icon-primary'>
                  {currentUser?.codigo.toUpperCase()}
                </a>
                {/* end::Menu wrapper */}
              </div>
              {/* end::Notifications */}

              {/* begin::Quick links */}
              <div className='d-flex align-items-center'>
                {/* begin::Menu wrapper */}
                <a onClick={logout  }
                  className='btn btn-sm   btn-icon-muted btn-active-icon-danger'>
                  <i className="fa-solid fa-right-from-bracket"></i>
                </a>
                <Link to={"/empresaform?id="+ currentUser?.empresa[0]._id}  
                className='btn btn-sm   btn-icon-muted btn-active-icon-danger'>
                <i className="fa-solid fa-gear"></i>
                </Link>
                {/* end::Menu wrapper */}
              </div>
              {/* end::Quick links */}

              {/* begin::Theme mode */}
              <div className='d-flex align-items-center'>
                <ThemeModeSwitcher toggleBtnClass='btn btn-sm btn-icon btn-icon-muted btn-active-icon-primary' />
              </div>
              {/* end::Theme mode */}
            </div>
            {/* end::Actions */}
          </div>
          {/* end::Action wrapper */}
        </div>
        {/* end::Toolbar container */}
      </div>
    </div>
  )
}

export {HeaderToolbar}
