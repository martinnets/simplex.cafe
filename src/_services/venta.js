

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/venta";
class ventaService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getventa(id){
        return fetch( API_BASE_URL +'/todo/'+id) 
    }
    createventa(venta){
        return axios.post(API_BASE_URL, venta,{
            headers: {'Content-Type': 'application/json'}
        })}
    createventacorrelativo(venta){
        return axios.post(API_BASE_URL+'/cod/', venta,{
            headers: {'Content-Type': 'application/json'}
        })}
    getventaById(ventaId){
        return fetch(API_BASE_URL + '/' + ventaId);
    }
    updateventa(ventaId, venta){
        return axios.put(API_BASE_URL+'/'+ventaId , venta,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteventa(ventaId){
        return axios.delete(API_BASE_URL + '/' + ventaId);
    }
}

export default new ventaService()