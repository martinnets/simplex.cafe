

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/cotizacion";
class cotizacionService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getcotizacion(id){
        return fetch( API_BASE_URL +'/todo/'+id ) 
    }
    createcotizacion(cotizacion){
        return axios.post(API_BASE_URL, cotizacion,{
            headers: {'Content-Type': 'application/json'}
        })}
    getcotizacionById(cotizacionId){
        return fetch(API_BASE_URL + '/' + cotizacionId);
    }
    getcorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updatecotizacion( id,cotizacion){
        return axios.put(API_BASE_URL +'/'+id, cotizacion,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletecotizacion(cotizacionId){
        return axios.delete(API_BASE_URL + '/' + cotizacionId);
    }
}

export default new cotizacionService()