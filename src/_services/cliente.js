

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/cliente";
class clienteService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getcliente(id){
        return fetch( API_BASE_URL +'/todo/'+id) 
    }
    createcliente(cliente){
        return axios.post(API_BASE_URL, cliente,{
            headers: {'Content-Type': 'application/json'}
        })}
    getclienteById(clienteId){
        return fetch(API_BASE_URL + '/' + clienteId);
    }
    updatecliente(clienteId, cliente){
        return axios.put(API_BASE_URL +'/'+clienteId, cliente,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletecliente(clienteId){
        return axios.delete(API_BASE_URL + '/' + clienteId);
    }
}

export default new clienteService()