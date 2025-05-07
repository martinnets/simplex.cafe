
import React, { useEffect,useState} from "react";
import { Link ,useNavigate} from "react-router-dom";
import productoDataService from "../../../_services/producto";
import { useAuth } from "../../modules/auth";
import { Producto } from "../../../_models/producto";



export default function ProductoForm()  {
  const { currentUser } = useAuth()
  const navigate = useNavigate();
  const queryParameters = new URLSearchParams(window.location.search)
  const idproducto = queryParameters.get("id")
  const [producto, setproducto] = useState<Producto>({});
  const handleSubmit = async (e ) => {
            e.preventDefault();
            const answer = window.confirm("Esta seguro de Guardar el Registro?");
            if (answer) {
              console.log(producto);
              if (idproducto  == null){
                producto.usu_crea = currentUser?.codigo
                producto.codigo_estado = '1'
                producto.empresaId= currentUser?.empresa[0]._id
                productoDataService.createproducto(producto)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Insertado correctamente");
                      navigate('/producto');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
              } else {
                producto.usu_modi = currentUser?.codigo
                producto._id=idproducto
                productoDataService.updateproducto(idproducto,producto)
                    .then(function (response) {
                      console.log(JSON.stringify(response.data));
                      alert("Registro Actualizado correctamente");
                      navigate('/producto');
                    })
                    .catch(function (error) {
                      console.log(error);
                    });
               
              }
            }
    };
    const handleChange = (e ) => {
        console.log();
        setproducto((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    useEffect(() => {
        if (idproducto  !== null){
             productoDataService.getproductoById(idproducto)
                .then(response => response.json())
                .then(result => {
                    setproducto(result);
                    console.log(result);
                })
                .catch(e => {
                console.log(e);
                });
            }
        }, []);
    return (
            <>
             <form   onSubmit={handleSubmit}>
                <div className="alert alert-secondary d-flex align-items-center p-5 bg-light-primary">
                                    <div className="d-flex flex-column">
                                        <h3 className="mb-1 text-dark">Registro de Producto</h3>
                                        <span className="text-dark">Detalle
                                        </span>
                                    </div>
                                    <div className="d-flex   flex-row-fluid justify-content-end">
                
                                        <Link to={"/producto"}
                                            className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                                            <i className="fa-solid fa-reply "></i>
                                            Volver
                                        </Link>
                                        <button className='btn btn-primary btn-sm' type="submit">
                                            <i className="fa-solid fa-floppy-disk"></i>
                                            Guardar</button>
                                    </div>
                                </div>
            <div className="card card-custom">
            
            <div className="card-body pt-10">
                <div className="form-group row">
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Código</label>
                                         <input type="text" name="codigo" required  defaultValue={producto.codigo} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Producto</label>
                                         <input type="text" name="producto" required defaultValue={producto.producto} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-6  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Descripción</label>
                                         <input type="text" name="descripcion" required defaultValue={producto.descripcion} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Categoría</label>
                                         <input type="text" name="categoria"  defaultValue={producto.categoria} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Marca</label>
                                         <input type="text" name="marca"  defaultValue={producto.marca} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Material</label>
                                         <input type="text" name="material"  defaultValue={producto.material} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Color</label>
                                         <input type="text" name="color"  defaultValue={producto.color} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Modelo</label>
                                         <input type="text" name="modelo"  defaultValue={producto.modelo} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Sub Marca</label>
                                         <input type="text" name="submarca"  defaultValue={producto.submarca} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Grupo</label>
                                         <input type="text" name="grupo"  defaultValue={producto.grupo} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Tamaño</label>
                                         <input type="text" name="tamaño"  defaultValue={producto.tamaño} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Genero</label>
                                    <select className="form-control"   onChange={handleChange}
                                        name="genero">
                                        <option value="">[Seleccione]</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="femenino">Femenino</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Precio Unitario </label>
                                    <input type="number" name="precio_unitario" placeholder="0.00"  defaultValue={producto.tamaño} 
                                         className="form-control text-end" onChange={handleChange}  />  
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Costo Unitario</label>
                                    <input type="text" name="costo_unitario"   placeholder="0.00" 
                                    defaultValue={producto.costo_unitario} 
                                         className="form-control text-end" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">imagen</label>
                                         <input type="text" name="imagen"  defaultValue={producto.imagen} 
                                         className="form-control" onChange={handleChange}  />
                                </div>
                            </div>
                            <div className="col-lg-2  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Tipo Existencia</label>
                                         <select className="form-control" required onChange={handleChange} 
                                            name="tipo_existencia" value={producto.tipo_existencia}>
                                           <option value="">[Seleccione]</option>
                                            <option value="mercaderia">Mercaderia</option> 
                                            <option value="producto">Producto Terminado</option> 
                                            <option value="materia">Materia Prima</option> 
                                            <option value="envase">Envases y Embalajes</option>    
                                            <option value="suministro">Suministros</option> 
                                            <option value="otro">Otros</option> 
                                            <option value="servicios">Servicio</option> 
                                        </select>
                                </div>
                            </div>
                </div>
            </div>
        </div>
        </form>
        </>
        );
    }
