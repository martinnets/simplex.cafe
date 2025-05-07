

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/cita";
class citaService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getcita(id){
        return fetch( API_BASE_URL +'/todo/'+id) 
    }
    createcita(cita){
        return axios.post(API_BASE_URL, cita,{
            headers: {'Content-Type': 'application/json'}
        })}
    getcitaById(citaId){
        return fetch(API_BASE_URL + '/' + citaId);
    }
    updatecita(citaId, cita){
        return axios.put(API_BASE_URL , cita,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletecita(citaId){
        return axios.delete(API_BASE_URL + '/' + citaId);
    }
}

export default new citaService()