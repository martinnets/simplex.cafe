

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/cotizaciondet";
class cotizaciondetService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getcotizaciondet(id){
        return fetch( API_BASE_URL +'/todo/'+id ) 
    }
    createcotizaciondet(cotizaciondet){
        return axios.post(API_BASE_URL, cotizaciondet,{
            headers: {'Content-Type': 'application/json'}
        })}
    getcotizaciondetById(cotizaciondetId){
        return fetch(API_BASE_URL + '/' + cotizaciondetId);
    }
    getcorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updatecotizaciondet( id,cotizaciondet){
        return axios.put(API_BASE_URL +'/'+id, cotizaciondet,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletecotizaciondet(cotizaciondetId){
        return axios.delete(API_BASE_URL + '/' + cotizaciondetId);
    }
}

export default new cotizaciondetService()