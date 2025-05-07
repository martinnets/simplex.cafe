

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/empresa";
class empresaService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getempresa(){
        return fetch( API_BASE_URL ) 
    }
    createempresa(empresa){
        return axios.post(API_BASE_URL, empresa,{
            headers: {'Content-Type': 'multipart/form-data'}
        })}
    createempresalogo(id,data){
        var formdata = new FormData();
        formdata.append("id_capacitacion", id );
        formdata.append("file", data, "'"+data.name+"'" );
        formdata.append("name", data.name);
        formdata.append("contentType", data.type);
        formdata.append("contenido", data );
        formdata.append("size", data.size);
        console.log(formdata);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {'Content-Type': 'multipart/form-data'}
        };
        //headers: {'Content-Type': 'application/json'}
        return fetch(API_BASE_URL+'/logo/'+id,requestOptions)}
    getempresaById(empresaId){
        return fetch(API_BASE_URL + '/' + empresaId);
    }
    updateempresa( empresaId,empresa){
        return axios.put(API_BASE_URL+'/'+ empresaId, empresa,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteempresa(empresaId){
        return axios.delete(API_BASE_URL + '/' + empresaId);
    }
}

export default new empresaService()