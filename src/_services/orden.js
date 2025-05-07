

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/orden";
class ordenService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getorden(id){
        return fetch( API_BASE_URL +'/todo/'+id) 
    }
    createorden(orden){
        return axios.post(API_BASE_URL, orden,{
            headers: {'Content-Type': 'application/json'}
        })}
    getordenById(ordenId){
        return fetch(API_BASE_URL + '/' + ordenId);
    }
    getordencorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updateorden( ordenId,orden){
        return axios.put(API_BASE_URL +'/'+ordenId, orden,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteorden(ordenId){
        return axios.delete(API_BASE_URL + '/' + ordenId);
    }
}

export default new ordenService()