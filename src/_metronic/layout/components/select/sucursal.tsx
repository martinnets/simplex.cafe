
import React, {FC, useEffect, useState} from 'react'
import sucursalDataService from '../../../../_services/sucursal';
type Props = {
  empresaId: string
}
const DDlSucursal: FC<Props> = ({empresaId}) => {
  const [data, setData] = useState([]);
  useEffect(() => { 
    sucursalDataService.getsucursal(empresaId) 
            .then(response => response.json())
            .then(response => {
              setData	(response)
            })
            .catch(e => {
              console.log(e);
            });
  }, []);
  return (
  <>
   {data.map(item => {
      return (
        <option value={item._id}>{item.descripcion}</option>
        )
      })}
  </>
  )
}

export {DDlSucursal}
