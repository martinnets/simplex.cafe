

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/accion";
class accionService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getaccion(id){
        return fetch( API_BASE_URL +'/todo/'+id ) 
    }
    createaccion(accion){
        return axios.post(API_BASE_URL, accion,{
            headers: {'Content-Type': 'application/json'}
        })}
    getaccionById(accionId){
        return fetch(API_BASE_URL + '/' + accionId);
    }
    updateaccion( id,accion){
        return axios.put(API_BASE_URL +'/'+id, accion,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteaccion(accionId){
        return axios.delete(API_BASE_URL + '/' + accionId);
    }
}

export default new accionService()