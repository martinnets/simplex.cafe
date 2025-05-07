import React, {FC, useEffect, useState} from 'react'
import parametroDataService from '../../../../_services/parametro';
import parametro from '../../../../_services/parametro';
import { useAuth } from '../../../../app/modules/auth';
type Props = {
  dominio: string
}
const DDlParametro: FC<Props> = ({dominio}) => {
  const { currentUser } = useAuth()
  const [parametro, setParametro] = useState([]);
  useEffect(() => {
    const data = {
      "empresaId":currentUser?.empresa[0]._id,
      "dominio":dominio
    }
    console.log(data)
    parametroDataService.getparametroByCod(data)
      .then(function (response) {
        setParametro	(response.data)
      })
      .catch(e => {
      console.log(e);
      });
  }, []);
  return (
  <>
   {parametro.map(item => {
      return (
        <option value={item.codigo}>{item.parametro}</option>
        )
      })}
  </>
  )
}

export {DDlParametro}
