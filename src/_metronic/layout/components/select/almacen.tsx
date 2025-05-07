import React, {FC, useEffect, useState} from 'react'

import almacenDataService from '../../../../_services/almacen';
type Props = {
  empresaId: string
}
const DDLAlmacen: FC<Props> = ({empresaId}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    almacenDataService.getalmacen(empresaId)
            .then(response => response.json())
            .then(response => {
              setData(response)
             // console.log(response)
            })
            .catch(e => {
              console.log(e);
            });
  }, []);
  return (
  <>
   {data.map(item => {
      return (
        <option id={item._id} value={item._id}>{item.almacen}</option>
        )
      })}
  </>
  )
}

export {DDLAlmacen}
