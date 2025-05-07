

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/consulta";
class consultaService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getconsulta(id){
        return fetch( API_BASE_URL +'/todo/'+id) 
    }
    createconsulta(consulta){
        return axios.post(API_BASE_URL, consulta,{
            headers: {'Content-Type': 'application/json'}
        })}
    getconsultaById(consultaId){
        return fetch(API_BASE_URL + '/' + consultaId);
    }
    updateconsulta( consultaId,consulta){
        return axios.put(API_BASE_URL+'/'+consultaId , consulta,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteconsulta(consultaId){
        return axios.delete(API_BASE_URL + '/' + consultaId);
    }
}

export default new consultaService()