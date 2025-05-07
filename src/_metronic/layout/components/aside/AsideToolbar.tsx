import {useAuth} from '../../../../app/modules/auth'
import {KTIcon, toAbsoluteUrl} from '../../../helpers'
import {HeaderUserMenu, Search} from '../../../partials'


const AsideToolbar = () => {
  const {currentUser, logout} = useAuth()

  return (
    <>
      {/*begin::User*/}
      <div className='aside-user d-flex align-items-sm-center justify-content-center py-5'>
        {/*begin::Symbol*/}
        <div className='symbol symbol-50px'>
          <img src={toAbsoluteUrl('media/avatars/user.png')} alt='' />
        </div>
        {/*end::Symbol*/}

        {/*begin::Wrapper*/}
        <div className='aside-user-info flex-row-fluid flex-wrap ms-5'>
          {/*begin::Section*/}
          <div className='d-flex'>
            {/*begin::Info*/}
            <div className='flex-grow-1 me-2'>
              {/*begin::Username*/}
              <a href='#' className='text-white text-hover-primary fs-6 fw-bold'>
                {currentUser?.usuario}
              </a>
              {/*end::Username*/}

              {/*begin::Description*/}
              <span className='text-gray-600 fw-bold d-block fs-8 mb-1'>{currentUser?.rol}</span>
              {/*end::Description*/}

              {/*begin::Label*/}
              <div className='d-flex align-items-center text-success fs-9'>
                <span className='bullet bullet-dot bg-success me-1'></span>
                {currentUser?.empresa[0].empresa}
              </div>
              {/*end::Label*/}
            </div>
            {/*end::Info*/}

            {/*begin::User menu*/}
            <div className='me-n2'>
              {/*begin::Action*/}
              <a
                onClick={ logout  }
                className='btn btn-icon btn-sm btn-active-color-primary mt-n2'
                data-kt-menu-trigger='click'
                data-kt-menu-placement='bottom-start'
                data-kt-menu-overflow='false'
              >
                
                <i className="fa-solid fa-right-from-bracket fs-2"></i>
              </a>

            
              {/*end::Action*/}
            </div>
            {/*end::User menu*/}
          </div>
          {/*end::Section*/}
        </div>
        {/*end::Wrapper*/}
      </div>
      {/*end::User*/}

      {/*begin::Aside search*/}
      <div >
        {/* <?php Theme::getView('partials/search/_inline', array(
        'class' => 'w-100',
        'menu-placement' => 'bottom-start',
        'responsive' => 'false'
    ))?> */}
         
      </div>
      {/*end::Aside search*/}
    </>
  )
}

export {AsideToolbar}
