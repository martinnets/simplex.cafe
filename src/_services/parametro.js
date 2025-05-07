

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/parametro";
class parametroService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getparametro(id){
        return fetch( API_BASE_URL +'/todo/'+id) 
    }
    createparametro(parametro){
        return axios.post(API_BASE_URL, parametro,{
            headers: {'Content-Type': 'application/json'}
        })}
    getparametroById(parametroId){
        return fetch(API_BASE_URL + '/' + parametroId);
    }
    getparametroByCod(dominio){
        return axios.post(API_BASE_URL + '/cod' , dominio);
    }
    updateparametro( parametroId,parametro){
        return axios.put(API_BASE_URL +'/'+parametroId, parametro,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteparametro(parametroId){
        return axios.delete(API_BASE_URL + '/' + parametroId);
    }
}

export default new parametroService()