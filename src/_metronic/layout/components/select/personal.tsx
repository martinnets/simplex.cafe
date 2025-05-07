
import React, {FC, useEffect, useState} from 'react'
import personalDataService from '../../../../_services/personal';
type Props = {
  empresaId:string,
  puesto:string
}
const DDlPersonal: FC<Props> = ({empresaId,puesto}) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const data = {
      "empresaId":empresaId,
      "puesto":puesto
    }
    personalDataService.getpersonalByPuesto(data)
      .then(function (response){
        setData	(response.data)
        //console.log(response.data)
      })
      .catch(e => {
        console.log(e);
      });
  }, []);
  return (
  <>
   {data.map(item => {
      return (
        <option value={item._id}>{item.personal}</option>
        )
      })}
  </>
  )
}

export {DDlPersonal}
