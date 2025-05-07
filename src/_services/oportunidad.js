

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/oportunidad";
class oportunidadService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getoportunidad(id){
        return fetch( API_BASE_URL +'/todo/'+id ) 
    }
    createoportunidad(oportunidad){
        return axios.post(API_BASE_URL, oportunidad,{
            headers: {'Content-Type': 'application/json'}
        })}
    getoportunidadById(oportunidadId){
        return fetch(API_BASE_URL + '/' + oportunidadId);
    }
    updateoportunidad( id,oportunidad){
        return axios.put(API_BASE_URL +'/'+id, oportunidad,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteoportunidad(oportunidadId){
        return axios.delete(API_BASE_URL + '/' + oportunidadId);
    }
}

export default new oportunidadService()