
import {useEffect} from 'react'
import {Outlet, Link} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../_metronic/helpers'

const AuthLayout = () => {
  useEffect(() => {
    const root = document.getElementById('root')
    if (root) {
      root.style.height = '100%'
    }
    return () => {
      if (root) {
        root.style.height = 'auto'
      }
    }
  }, [])

  return (
    <>
    <div className="d-flex flex-column flex-root" id="kt_app_root">
			<div className="d-flex flex-column flex-lg-row flex-column-fluid " style={{backgroundColor:"#302220"}} >
				<a href="#" className="d-block d-lg-none mx-auto py-20">
					<img alt="Logo" src="media/logo-simplex-negocio-white.png" className="theme-light-show h-60px" />
					<img alt="Logo" src="media/logo-simplex-negocio-white.png" className="theme-dark-show h-25px" />
				</a>
				<div className="d-flex flex-column flex-column-fluid flex-center w-lg-50 p-10">
					<div className="d-flex justify-content-between flex-column-fluid flex-column w-100 mw-450px">
						<div className="py-20">
            <Outlet />
						</div>
						<div className="m-0">
            <span className='menu-title text-light '>Versión {import.meta.env.VITE_APP_VERSION}</span>
							<div className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-semibold w-200px py-4" data-kt-menu="true" id="kt_auth_lang_menu">
              
              
							</div>
						</div>
					</div>
				</div>
				<div className="d-none d-lg-flex flex-lg-row-fluid w-50 bg-secondary " >
        <div style={{ backgroundColor : '#f8f3eb' }} className=" d-flex flex-column flex-center py-15 px-5 px-md-15 w-100  " >
          <a className="mb-12" href="/"><img alt="Logo" src="/logo-cafe.png" 
          className="h-500px"/></a></div>
        </div>
			</div>
		</div>
  
        
{/*    
        <div className='d-flex flex-center flex-wrap px-5'>
           <div className='d-flex fw-semibold text-primary fs-base'>
            <a href='#' className='px-5' target='_blank'>
              Guia de Uso
            </a>
            <a href='https://wa.me/51955043585' className='px-5' target='_blank'>
              Soporte
            </a>
          </div>
         </div> */}
       
    </>
  )
}

export {AuthLayout}
