

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/dominio";
class dominioService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getdominio(id){
        return fetch( API_BASE_URL +'/todo/'+id) 
    }
    createdominio(dominio){
        return axios.post(API_BASE_URL, dominio,{
            headers: {'Content-Type': 'application/json'}
        })}
    getdominioById(dominioId){
        return fetch(API_BASE_URL + '/' + dominioId);
    }
    updatedominio( dominio){
        return axios.put(API_BASE_URL  , dominio,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletedominio(dominioId){
        return axios.delete(API_BASE_URL + '/' + dominioId);
    }
}

export default new dominioService()