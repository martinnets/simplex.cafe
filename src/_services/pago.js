

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/pago";
class pagoService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getpago(id){
        return fetch( API_BASE_URL +'/todo/'+id) 
    }
    getpagopendiente(id){
        return fetch( API_BASE_URL +'/pendiente/'+id) 
    }
    createpago(pago){
        return axios.post(API_BASE_URL, pago,{
            headers: {'Content-Type': 'application/json'}
        })}
    getpagoById(pagoId){
        return fetch(API_BASE_URL + '/' + pagoId);
    }
    getpagokpi(pago){
        return axios.post( API_BASE_URL +'/kpi',pago) 
    }
    reportepago(pago){
        return axios.post(API_BASE_URL+'/rep', pago )}
    reportexdia(pago){
        return axios.post(API_BASE_URL+'/dia', pago )}
    reportepago_metodo(pago){
        return axios.post(API_BASE_URL+'/metodo', pago )}
    reportepago_categoria(pago){
        return axios.post(API_BASE_URL+'/categoria', pago )}
    getpagocorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updatepago(id, pago){
        return axios.put(API_BASE_URL +'/'+id, pago,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletepago(pagoId){
        return axios.delete(API_BASE_URL + '/' + pagoId);
    }
}

export default new pagoService()