

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/nota";
class notaService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getnota(id){
        return fetch( API_BASE_URL +'/todo/'+id) 
    }
    getnotatop(id){
        return fetch( API_BASE_URL +'/top/'+id ) 
    }
    getnotakpi(nota){
        return axios.post( API_BASE_URL +'/kpi',nota ) 
    }
    createnota(nota){
        return axios.post(API_BASE_URL, nota,{
            headers: {'Content-Type': 'application/json'}
        })}
    getnotaById(notaId){
        return fetch(API_BASE_URL + '/' + notaId);
    }
    getnotacorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updatenota( notaId, nota){
        return axios.put(API_BASE_URL+'/'+notaId , nota,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletenota(notaId){
        return axios.delete(API_BASE_URL + '/' + notaId);
    }
}

export default new notaService()