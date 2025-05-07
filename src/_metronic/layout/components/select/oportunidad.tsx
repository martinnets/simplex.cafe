
import React, {FC, useEffect, useState} from 'react'
import oportunidadDataService from '../../../../_services/oportunidad';
type Props = {
  empresaId:string
}
const DDLOportunidad: FC<Props> = ({empresaId}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const data = {
      "empresaId":empresaId
    }
    oportunidadDataService.getoportunidad(empresaId)
      .then(response => response.json())
      .then(response => {
        setData(response)
        //console.log(response)
      })
      .catch(e => {
        console.log(e);
      });
  }, []);
  return (
  <>
   {data.map(item => {
      return (
        <option value={item._id}>{item.nombre}</option>
        )
      })}
  </>
  )
}

export {DDLOportunidad}
