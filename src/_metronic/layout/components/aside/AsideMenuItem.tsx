import {FC} from 'react'
import clsx from 'clsx'
import {Link} from 'react-router-dom'
import {useLocation} from 'react-router'
import {checkIsActive, KTIcon, WithChildren} from '../../../helpers'

type Props = {
  to: string
  title: string
  icon?: string
  fontIcon?: string
  hasBullet?: boolean
  visible?:boolean
  pdominio?:string
}

const AsideMenuItem: FC<Props & WithChildren> = ({
  children,
  to,
  title,
  icon,
  fontIcon,
  hasBullet = false,
  visible=true,
  pdominio=''
}) => {
  const {pathname} = useLocation()
  const isActive = checkIsActive(pathname, to)

  return (
    <>
    {visible?
      <>
    <div className='menu-item'>
      {/* <Link className={clsx('menu-link without-sub', {active: isActive})} to={to}> */}
      <Link className='menu-link without-sub' to={to} state={pdominio}   >
        {hasBullet && (
          <span className='menu-bullet'>
            <span className='bullet bullet-dot'></span>
          </span>
        )}
        {icon && (
          <span className='menu-icon'>
            <KTIcon iconName={icon} className='fs-2' />
          </span>
        )}
        {fontIcon && <i className={clsx('bi fs-3', fontIcon)}></i>}
        <span className='menu-title'>{title}</span>
      </Link>
      {children}
    </div>
    </>:
    <>
    </>}
    </>
  )
}

export {AsideMenuItem}
