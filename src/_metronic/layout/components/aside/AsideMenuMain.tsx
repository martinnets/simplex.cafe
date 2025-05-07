
import {useIntl} from 'react-intl'
import {KTIcon} from '../../../helpers'
import {AsideMenuItemWithSub} from './AsideMenuItemWithSub'
import {AsideMenuItem} from './AsideMenuItem'
import { useAuth } from '../../../../app/modules/auth'
import { Link } from 'react-router-dom'
import { display } from 'html2canvas/dist/types/css/property-descriptors/display'

export function AsideMenuMain() {
  const intl = useIntl()
  const {currentUser, logout} = useAuth()
   

  return (
    <>
       <AsideMenuItem
        to='/dashboard'
        icon='element-11'
        title={intl.formatMessage({id: 'MENU.DASHBOARD'})}
      />
      {/* <AsideMenuItem to='/dashboardventas' icon='element-12' title='Dashboard Ventas' />
      <AsideMenuItem to='/dashboardalmacen' icon='element-12' title='Dashboard Almacen' /> */}
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Modulos</span>
        </div>
      </div>
      <AsideMenuItemWithSub to='' title='Ventas' icon='basket' visible={currentUser?.ventas}  >
          <AsideMenuItem to='/cliente' title='Cliente' hasBullet={true} />
          <AsideMenuItem to='/nota' title='Nota de Venta' hasBullet={true} />
          <AsideMenuItem to='/pedido' title='Pedidos'  hasBullet={true} />
          <AsideMenuItem to='/cotizacion' title='Cotizacion'  hasBullet={true} />
          <AsideMenuItem to='/venta' title='Ventas' hasBullet={true} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to='' title='Compras' icon='handcart' visible={currentUser?.compras} >
          <AsideMenuItem to='/proveedor' title='Proveedor' hasBullet={true} />
          <AsideMenuItem to='/orden' title='Orden de Compra'  hasBullet={true} />
          <AsideMenuItem to='/compra' title='Facturas de Compra' hasBullet={true} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to='' title='Comercial' icon='dollar' visible={currentUser?.comercial} >
          <AsideMenuItem to='/lead' title='Lead' hasBullet={true} />
          <AsideMenuItem to='/oportunidad' title='Oportunidad' hasBullet={true} />
          <AsideMenuItem to='/accion' title='Accion' hasBullet={true} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to='' title='Finanzas' icon='dollar' visible={currentUser?.finanzas} >
          <AsideMenuItem to='/ingreso' title='Ingresos' hasBullet={true} />
          <AsideMenuItem to='/pago' title='Pagos' hasBullet={true} />
          <AsideMenuItem to='/pagopendiente' title='Pagos Pendientes' hasBullet={true} />
      </AsideMenuItemWithSub>
      
      <AsideMenuItemWithSub to='//' title='Inventario' icon='barcode' visible={currentUser?.inventario} >
        <AsideMenuItem to='/almacen' title='Almacen' hasBullet={true} />
        <AsideMenuItem to='/producto' title='Producto'   hasBullet={true}  />
        <AsideMenuItem to='/productokardex' title='Movimientos' hasBullet={true} />
        <AsideMenuItem to='/kardex' title='Kardex' hasBullet={true} />
        <AsideMenuItem to='/kardexform?tipo=1' title='Ingreso' hasBullet={true} />
        <AsideMenuItem to='/kardexform?tipo=0' title='Salida' hasBullet={true} />
        <AsideMenuItem to='/kardexreporte' title='Reporte' hasBullet={true} />
      </AsideMenuItemWithSub>
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Configuración</span>
        </div>
      </div>
      <AsideMenuItemWithSub to='//' title='Maestros' icon='profile-circle' visible={true} >
        <AsideMenuItem to='/cliente' title='Cliente' hasBullet={true} visible={true} />
        <AsideMenuItem to='/proveedor' title='Proveedor' hasBullet={true} visible={true}  />
        <AsideMenuItem to='/personal' title='Personal' hasBullet={true} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub to='/crafted/widgets' title='Parametros' icon='element-plus' visible={true}>        
       <AsideMenuItem to='/dominio/puesto' title='Puesto' pdominio='puesto' hasBullet={true} />
       <AsideMenuItem to='/dominio/sucursal' title='Sucursal' pdominio='sucursal' hasBullet={true} />
      </AsideMenuItemWithSub>
      
      <div className='menu-item'>
      
      <a onClick={logout  }
       className='menu-link px-5'>
      <span className='menu-icon'>
      <i className="fa-solid fa-right-from-bracket"></i>
          </span>
          <span className='menu-title '>Cerrar Sesión</span>
        </a>
         
      </div>
    </>
  )
}
