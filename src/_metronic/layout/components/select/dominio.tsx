import React, {FC, useEffect, useState} from 'react'
import dominioDataService from '../../../../_services/dominio';
import parametro from '../../../../_services/parametro';
import { useAuth } from '../../../../app/modules/auth';

const DDlDominio: FC = () => {
  const { currentUser } = useAuth()
  const [data, setData] = useState([]);
  useEffect(() => {
    dominioDataService.getdominio(currentUser?.empresa[0]._id)
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
        <option value={item.codigo}>{item.dominio}</option>
        )
      })}
  </>
  )
}

export {DDlDominio}
