

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/compra";
class compraService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getcompra(id){
        return fetch( API_BASE_URL +'/todo/'+id) 
    }
    createcompra(compra){
        return axios.post(API_BASE_URL, compra,{
            headers: {'Content-Type': 'application/json'}
        })}
    getcompraById(compraId){
        return fetch(API_BASE_URL + '/' + compraId);
    }
    updatecompra(compraId, compra){
        return axios.put(API_BASE_URL +'/'+compraId, compra,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletecompra(compraId){
        return axios.delete(API_BASE_URL + '/' + compraId);
    }
}

export default new compraService()