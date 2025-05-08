
import React from 'react'
import {KTIcon} from '../../../helpers'

type Props = {
  className: string
  color: string
  svgIcon: string
  iconColor: string
  title: string
  titleColor?: string
  description: string
  descriptionColor?: string
}

const StatisticsWidget5: React.FC<Props> = ({
  className,
  color,
  svgIcon,
  iconColor,
  title,
  titleColor,
  description,
  descriptionColor,
}) => {
  return (
    <a href='#' className={`card bg-${color} hoverable ${className}`}>
      <div className='card-body'>
        <i className={`fa fa-solid fa-${svgIcon} text-${iconColor}  fs-3x ms-n1 text-light`}></i>
        <div className={`fw-bold text-${descriptionColor} pt- fs-4`} >{description}</div>
        <div className={`text-${titleColor} fw-bold fs-2x mb-2 mt-5`}>{title}</div>
      </div>
    </a>
  )
}

export {StatisticsWidget5}
