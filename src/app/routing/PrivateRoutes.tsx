import {FC, lazy, Suspense} from 'react'
import {Navigate, Route, Routes} from 'react-router-dom'
import {MasterLayout} from '../../_metronic/layout/MasterLayout'
import TopBarProgress from 'react-topbar-progress-indicator'
import {DashboardWrapper} from '../pages/dashboard/DashboardWrapper'
import {MenuTestPage} from '../pages/MenuTestPage'
import {getCSSVariableValue} from '../../_metronic/assets/ts/_utils'
import {WithChildren} from '../../_metronic/helpers'
import BuilderPageWrapper from '../pages/layout-builder/BuilderPageWrapper'

import  {ProductoPage }from '../pages/producto/producto'
import ProductoForm from '../pages/producto/productoform'
import { DominioPage } from '../pages/dominio/dominio'
import DominioForm from '../pages/dominio/dominioform'
import { ParametroPage } from '../pages/parametro/parametro'
import ParametroForm from '../pages/parametro/parametroform'
import { ClientePage } from '../pages/cliente/cliente'
import ClienteForm from '../pages/cliente/clienteform'
import { EmpresaPage } from '../pages/empresa/empresa'
import EmpresaForm from '../pages/empresa/empresaform'
import ProductoImportar from '../pages/producto/productoimportar'
import { PedidoPage } from '../pages/pedido/pedido'
import PedidoForm from '../pages/pedido/pedidoform'
import { GastoPage } from '../pages/gasto/gasto'
import GastoForm from '../pages/gasto/gastoform'
import { ProveedorPage } from '../pages/proveedor/proveedor'
import ProveedorForm from '../pages/proveedor/proveedorform'
import { PersonalPage } from '../pages/personal/personal'
import PersonalForm from '../pages/personal/personalform'
import { KardexPage } from '../pages/kardex/kardex'
import KardexForm from '../pages/kardex/kardexform'
import { VentaPage } from '../pages/venta/venta'
import VentaForm from '../pages/venta/ventaform'
import { IngresoPage } from '../pages/ingreso/ingreso'
import IngresoForm from '../pages/ingreso/ingresoform'
import { PorCobrarPage } from '../pages/venta/porcobrar'
import { OrdenPage } from '../pages/orden/orden'
import { OrdendetPage } from '../pages/ordendet/ordendet'
import OrdendetForm from '../pages/ordendet/ordendetform'
import { NotaPage } from '../pages/nota/nota'
import NotaForm from '../pages/nota/notaform'
import { NotadetPage } from '../pages/notadet/notadet'
import NotadetForm from '../pages/notadet/notadetform'
import { NotaView } from '../pages/nota/notav'
import { IngresoReportePage } from '../pages/ingreso/reporte'
import { PanelPage } from '../pages/dashboard/Panel'
import { OrdenReportePage } from '../pages/orden/reporte'
import { NotaReportePage } from '../pages/nota/reporte'
import { CompraPage } from '../pages/compra/compra'
import CompraForm from '../pages/compra/compraform'
import { CompradetPage } from '../pages/compradet/compradet'
import CompradetForm from '../pages/compradet/compradetform'
import { AlmacenPage } from '../pages/almacen/almacen'
import AlmacenForm from '../pages/almacen/almacenform'
import { PagoPage } from '../pages/pago/pago'
import PagoForm from '../pages/pago/pagoform'
import { PagoReportePage } from '../pages/pago/reporte'
import { CajaReportePage } from '../pages/reporte/cuadrecaja'
import { ConsultaPage } from '../pages/consulta/consulta'
import ConsultaForm from '../pages/consulta/consultaform'
import { SucursalPage } from '../pages/sucursal/sucursal'
import SucursalForm from '../pages/sucursal/sucursalform'
import { KardexDetallePage } from '../pages/kardex/detalle'
import CitaForm from '../pages/cita/citaform'
import { CitaPage } from '../pages/cita/cita'
import PagoProg from '../pages/pago/pagoprog'
import { PagoPendientePage } from '../pages/pago/pagopendiente'
import { KardexReportePage } from '../pages/kardex/reporte'
import { LeadPage } from '../pages/lead/lead'
import LeadForm from '../pages/lead/leadform'
import { OportunidadPage } from '../pages/oportunidad/oportunidad'
import OportunidadForm from '../pages/oportunidad/oportunidadform'
import { AccionPage } from '../pages/accion/accion'
import AccionForm from '../pages/accion/accionform'
import { PanelVentasPage } from '../pages/dashboard/PanelVentas'
import { PanelAlmacenPage } from '../pages/dashboard/PanelAlmacen'
import { CotizacionPage } from '../pages/cotizacion/cotizacion'
import CotizacionForm from '../pages/cotizacion/cotizacionform'
import { CotizacionReportePage } from '../pages/cotizacion/reporte'
import { VentaReportePage } from '../pages/venta/reporte'

const PrivateRoutes = (props) => {
  const ProfilePage = lazy(() => import('../modules/profile/ProfilePage'))
  const WizardsPage = lazy(() => import('../modules/wizards/WizardsPage'))
  const AccountPage = lazy(() => import('../modules/accounts/AccountPage'))
  const WidgetsPage = lazy(() => import('../modules/widgets/WidgetsPage'))
  const ChatPage = lazy(() => import('../modules/apps/chat/ChatPage'))
  const UsersPage = lazy(() => import('../modules/apps/user-management/UsersPage'))

  return (
    <Routes>
      <Route element={<MasterLayout />}>
        {/* Redirect to Dashboard after success login/registartion */}
        <Route path='auth/*' element={<Navigate to='/dashboard' />} />
        {/* Pages */}
        <Route path='dashboard' element={<PanelPage />} />
        <Route path='dashboardventas' element={<PanelVentasPage />} />
        <Route path='dashboardalmacen' element={<PanelAlmacenPage />} />

        <Route path='producto' element={<ProductoPage />} />
        <Route path='productoform' element={<ProductoForm />} />
        <Route path='productocarga' element={<ProductoImportar />} />
        <Route path='productokardex' element={<KardexDetallePage />} />
       
        <Route path='dominio/:id'  element={<DominioPage  />}/>
        <Route path='dominio/:id' element={<DominioPage  />} />
        <Route path='dominioform' element={<DominioForm />} />

        <Route path='parametro' element={<ParametroPage />} />
        <Route path='parametroform' element={<ParametroForm />} />

        <Route path='cliente' element={<ClientePage />} />
        <Route path='clienteform' element={<ClienteForm />} />
        
        <Route path='empresa' element={<EmpresaPage />} />
        <Route path='empresaform' element={<EmpresaForm />} />
        
        <Route path='pedido' element={<PedidoPage />} />
        <Route path='pedidoform' element={<PedidoForm />} />
        <Route path='cotizacion' element={<CotizacionPage />} />
        <Route path='cotizacionform' element={<CotizacionForm />} />
        <Route path='cotizacionrep' element={<CotizacionReportePage />} />
        

        <Route path='gasto' element={<GastoPage />} />
        <Route path='gastoform' element={<GastoForm />} />

        <Route path='proveedor' element={<ProveedorPage />} />
        <Route path='proveedorform' element={<ProveedorForm />} />

        <Route path='personal' element={<PersonalPage />} />
        <Route path='personalform' element={<PersonalForm />} />

        <Route path='kardex' element={<KardexPage />} />
        <Route path='kardexform' element={<KardexForm />} />
        <Route path='kardexreporte' element={<KardexReportePage />} />
        
        <Route path='venta' element={<VentaPage />} />
        <Route path='porcobrar' element={<PorCobrarPage />} />
        <Route path='ventaform' element={<VentaForm />} />
        <Route path='ventarep' element={<VentaReportePage />} />
        
        <Route path='ingreso' element={<IngresoPage />} />
        <Route path='ingresoform' element={<IngresoForm />} />
        <Route path='ingresoreporte' element={<IngresoReportePage />} />

        <Route path='orden' element={<OrdenPage />} />
 
        <Route path='ordenreporte' element={<OrdenReportePage />} />
        
        <Route path='ordendet' element={<OrdendetPage />} />
        <Route path='ordendetform' element={<OrdendetForm />} />

        <Route path='nota' element={<NotaPage />} />
        <Route path='notav' element={<NotaView />} />
        <Route path='notaform' element={<NotaForm />} />
        <Route path='notareporte' element={<NotaReportePage />} />
        
        <Route path='notadet' element={<NotadetPage />} />
        <Route path='notadetform' element={<NotadetForm />} />


        <Route path='compra' element={<CompraPage />} />
        <Route path='compraform' element={<CompraForm />} />

        <Route path='compradet' element={<CompradetPage />} />
        <Route path='compradetform' element={<CompradetForm />} />

        <Route path='almacen' element={<AlmacenPage />} />
        <Route path='almacenform' element={<AlmacenForm />} />

        <Route path='pago' element={<PagoPage />} />
        <Route path='pagoform' element={<PagoForm />} />
        <Route path='pagoprog' element={<PagoProg />} />
        <Route path='pagopendiente' element={<PagoPendientePage />} />
        <Route path='pagoreporte' element={<PagoReportePage />} />
        <Route path='reportecaja' element={<CajaReportePage />} />
        
        <Route path='consulta' element={<ConsultaPage />} />
        <Route path='consultaform' element={<ConsultaForm />} />
        
        <Route path='sucursal' element={<SucursalPage />} />
        <Route path='sucursalform' element={<SucursalForm />} />
        
        <Route path='cita' element={<CitaPage />} />
        <Route path='citaform' element={<CitaForm />} />

        <Route path='lead' element={<LeadPage />} />
        <Route path='leadform' element={<LeadForm />} />

        <Route path='oportunidad' element={< OportunidadPage />} />
        <Route path='oportunidadform' element={< OportunidadForm />} />

        <Route path='accion' element={< AccionPage />} />
        <Route path='accionform' element={< AccionForm />} />
        <Route
          path='builder'
          element={
            <SuspensedView>
              <BuilderPageWrapper />
            </SuspensedView>
          }
        />
        <Route path='menu-test' element={<MenuTestPage />} />
        {/* Lazy Modules */}
        <Route
          path='crafted/pages/profile/*'
          element={
            <SuspensedView>
              <ProfilePage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/pages/wizards/*'
          element={
            <SuspensedView>
              <WizardsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/widgets/*'
          element={
            <SuspensedView>
              <WidgetsPage />
            </SuspensedView>
          }
        />
        <Route
          path='crafted/account/*'
          element={
            <SuspensedView>
              <AccountPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/chat/*'
          element={
            <SuspensedView>
              <ChatPage />
            </SuspensedView>
          }
        />
        <Route
          path='apps/user-management/*'
          element={
            <SuspensedView>
              <UsersPage />
            </SuspensedView>
          }
        />
        {/* Page Not Found */}
        <Route path='*' element={<Navigate to='/error/404' />} />
      </Route>
    </Routes>
  )
}

const SuspensedView: FC<WithChildren> = ({children}) => {
  const baseColor = getCSSVariableValue('--bs-primary')
  TopBarProgress.config({
    barColors: {
      '0': baseColor,
    },
    barThickness: 1,
    shadowBlur: 5,
  })
  return <Suspense fallback={<TopBarProgress />}>{children}</Suspense>
}

export {PrivateRoutes}
