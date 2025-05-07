
import React, {FC, useEffect, useState} from 'react'
import proveedorDataService from '../../../../_services/proveedor';
type Props = {
  empresaId:string
}
const DDlProveedor: FC<Props> = ({empresaId}) => {
  const [proveedor, setProveedor] = useState([]);
  useEffect(() => {
    proveedorDataService.getproveedor(empresaId)
            .then(response => response.json())
            .then(response => {
              setProveedor	(response)
            })
            .catch(e => {
              console.log(e);
            });
  }, []);
  return (
  <>
   {proveedor.map(item => {
      return (
        <option value={item._id}>{item.proveedor}</option>
        )
      })}
  </>
  )
}

export {DDlProveedor}
