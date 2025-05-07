

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/gasto";
class gastoService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getgasto(){
        return fetch( API_BASE_URL ) 
    }
    creategasto(gasto){
        return axios.post(API_BASE_URL, gasto,{
            headers: {'Content-Type': 'application/json'}
        })}
    getgastoById(gastoId){
        return fetch(API_BASE_URL + '/' + gastoId);
    }
    updategasto( gasto){
        return axios.put(API_BASE_URL , gasto,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletegasto(gastoId){
        return axios.delete(API_BASE_URL + '/' + gastoId);
    }
}

export default new gastoService()