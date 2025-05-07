
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import empresaDataService from "../../../_services/empresa";
import { useAuth } from "../../modules/auth";
import { Empresa } from "../../../_models/empresa";
import { DDlParametro } from "../../../_metronic/layout/components/select/parametro";
import { chownSync } from "fs";



export default function EmpresaForm() {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const idempresa = queryParameters.get("id")
    const [empresa, setempresa] = useState<Empresa>({});
    const [fileInput, setFileInput] = useState(null);
    const [selectedImageForDisplay, setselectedImageForDisplay] = useState(null);
    const [fileos, setFileOS] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const answer = window.confirm("Esta seguro de Guardar el Registro?");
        if (answer) {
            console.log(empresa);
            if (idempresa == null) {
                empresa.usu_crea = currentUser?.codigo
                empresa.codigo_estado = '1'
                empresaDataService.createempresa(empresa)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Insertado correctamente");
                        navigate('/empresa');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } else {
                empresa.usu_modi = currentUser?.codigo
                empresa._id = idempresa
                empresaDataService.updateempresa(idempresa, empresa)
                    .then(function (response) {
                        console.log(JSON.stringify(response.data));
                        alert("Registro Actualizado correctamente");
                        navigate('/');
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            }
        }
    };
    const handleChange = (e) => {
        console.log();
        setempresa((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };
    const handleFileChangeOrden = (e) => {
        //console.log(e)
        //console.log(e.target.files)
        const updatedFiles = [...fileos, e.target.files[0]];
        setFileOS(updatedFiles)
        console.log(fileos)
         
      }
    const onChangeHandle = (e) => {
        const updatedFiles = [...fileInput, e.target.files[0]];
        // setFileInput((prev) => ({
        //     ...prev,
        //     "file":e.target.files[0]
        // }))
        setFileInput(updatedFiles);
        console.log(fileInput)
      };
      function getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          console.log(reader.result);
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
     }
     
      const handleImageUpload = async () => {
        let result = getBase64(fileos[0]);
        console.log(result);
        //if (fileInput) {
    //         const formdata = new FormData();
    //         //formdata.append("imageId", "12345678");
    //         formdata.append("name", fileInput.file.name);
    //         formdata.append("contentType", fileInput.file.type);
    //         formdata.append("contenido", fileInput.file );
    //         formdata.append("size", fileInput.file.size);
    //     //  const formData = new FormData();
    //      // formData.append("image", fileInput);
    //   //  console.log(fileInput)
    //     console.log(formdata)
        // empresaDataService.createempresalogo(currentUser.empresa[0]._id,fileos[0])
        // // axios.pos("https://us-central1-cursoreapi.cloudfunctions.net/api/api/empresa/logo/6738fe6f15543a5001fde5de", {
        // //     method: "POST",
        // //     headers: {'Content-Type': 'multipart/form-data'},
        // //     body: formdata
        // //   })
        //   .then(function (response) {
        //     console.log(response);
        //   })
        //   .catch(function (error) {
        //     console.log(error);
        //   });
           
       // }
      };
    useEffect(() => {
        if (idempresa !== null) {
            empresaDataService.getempresaById(idempresa)
                .then(response => response.json())
                .then(result => {
                    setempresa(result);
                    console.log(result);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    }, []);
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="card card-custom">
                    <div className="card-header align-items-center py-5 gap-2 gap-md-5">
                        <div className="card-title">
                            <div className="d-flex align-items-center position-relative my-1">
                                <h2>Editar empresa</h2>
                            </div>
                        </div>

                        <div className="card-toolbar flex-row-fluid justify-content-end gap-5">
                            <Link to={"/"}
                                className="btn btn-icon-white btn-text-white btn-danger btn-sm">
                                <i className="fa-solid fa-reply "></i>
                                Volver
                            </Link>
                            <button className='btn btn-primary btn-sm' type="submit">
                                <i className="fa-solid fa-floppy-disk"></i>
                                Guardar</button>

                        </div>
                    </div>
                    <div className="separator separator-dashed border-danger my-1"></div>
                    <div className="card-body pt-10">
                        <div className="form-group row">
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Tipo Documento</label>
                                    <select className="form-control" onChange={handleChange}
                                        name="tipo_doc" value={empresa.tipo_doc}>
                                        <option value="">[Seleccione]</option>
                                        <DDlParametro dominio="tipo_doc" />
                                    </select>
                                </div>
                            </div>
                            <div className="col-lg-3  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Número Documento</label>
                                    <input type="text" name="nro_doc" required defaultValue={empresa.nro_doc}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-6  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Empresa</label>
                                    <input type="text" name="empresa" required defaultValue={empresa.empresa}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>

                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">web</label>
                                    <input type="url" name="web"  defaultValue={empresa.web}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Email</label>
                                    <input type="email" name="email" required defaultValue={empresa.email}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Teléfono</label>
                                    <input type="text" name="telefono" required defaultValue={empresa.telefono}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-12  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Dirección</label>
                                    <input type="text" name="direccion" required defaultValue={empresa.direccion}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                           
                         
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Departamento</label>
                                    <input type="text" name="dpto"  defaultValue={empresa.dpto}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Provincia</label>
                                    <input type="text" name="prov"  defaultValue={empresa.prov}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div className="col-lg-4  input-group-sm mb-5">
                                <div className="  mb-2">
                                    <label className="form-label" id="inputGroup-sizing-sm">Distrito</label>
                                    <input type="text" name="dist"  defaultValue={empresa.dist}
                                        className="form-control" onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                            <input type="file" id="files"   accept="image/*" 
                    //accept=".pdf"  
                    name ="adjunto_url" 
                    onChange={(e) => handleFileChangeOrden(e )}
                     
                    />
                            </div>
                            <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChangeHandle(e)}
        />
        <a
           className="btn btn-primary"
           onClick={handleImageUpload}
          style={{ margin: "20px" }}
        >
          Upload Image
        </a>
        {selectedImageForDisplay && (
          <div style={{ width: "200px", height: "200px" }}>
            <img
              src={selectedImageForDisplay}
              alt="Selected"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        )}
      </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
