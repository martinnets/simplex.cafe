
import React, {FC, useEffect, useState} from 'react'
import clienteDataService from '../../../../_services/cliente';
import Select from 'react-select';
type Props = {
  empresaId:string
}
const DDlCliente: FC<Props> = ({empresaId}) => {
  const [cliente, setCliente] = useState([]);
  useEffect(() => {
    clienteDataService.getcliente(empresaId)
      .then(response => response.json())
      .then(response => {
        setCliente	(response)
        console.log(response)
      })
      .catch(e => {
        console.log(e);
      });
  }, []);
  return (
  <>
    {/* <Select required placeholder="Seleccione Cliente"
                                        name="_id"  
                                        options={cliente}
                                        
                                        getOptionValue={option => option._id}
                                        getOptionLabel={option => option.cliente}
                                    /> */}
   {cliente.map(item => {
      return (
        <option value={item._id}>{item.cliente}</option>
        )
      })} 
  </>
  )
}

export {DDlCliente}
