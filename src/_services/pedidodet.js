

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/pedidodet";
class pedidodetService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getpedidodet(){
        return fetch( API_BASE_URL ) 
    }
    createpedidodet(pedidodet){
        return axios.post(API_BASE_URL, pedidodet,{
            headers: {'Content-Type': 'application/json'}
        })}
    getpedidodetById(pedidodetId){
        return fetch(API_BASE_URL + '/' + pedidodetId);
    }
    updatepedidodet( pedidodet){
        return axios.put(API_BASE_URL , pedidodet,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletepedidodet(pedidodetId){
        return axios.delete(API_BASE_URL + '/' + pedidodetId);
    }
}

export default new pedidodetService()