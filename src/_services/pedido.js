

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/pedido";
class pedidoService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getpedido(id){
        return fetch( API_BASE_URL +'/todo/'+id) 
    }
    createpedido(pedido){
        return axios.post(API_BASE_URL, pedido,{
            headers: {'Content-Type': 'application/json'}
        })}
    getpedidoById(pedidoId){
        return fetch(API_BASE_URL + '/' + pedidoId);
    }
    getpedidocorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updatepedido(pedidoId, pedido){
        return axios.put(API_BASE_URL +'/'+pedidoId, pedido,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletepedido(pedidoId){
        return axios.delete(API_BASE_URL + '/' + pedidoId);
    }
}

export default new pedidoService()