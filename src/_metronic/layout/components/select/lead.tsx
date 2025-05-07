
import React, {FC, useEffect, useState} from 'react'
import leadDataService from '../../../../_services/lead';
type Props = {
  empresaId:string
}
const DDlLead: FC<Props> = ({empresaId}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const data = {
      "empresaId":empresaId
    }
    leadDataService.getlead(empresaId)
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
        <option value={item._id}>{item.nombre_completo}</option>
        )
      })}
  </>
  )
}

export {DDlLead}
