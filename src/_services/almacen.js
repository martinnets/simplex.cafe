

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/almacen";
class almacenService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getalmacen(id){
        return fetch( API_BASE_URL +'/todo/'+id) 
    }
    createalmacen(almacen){
        return axios.post(API_BASE_URL, almacen,{
            headers: {'Content-Type': 'application/json'}
        })}
    getalmacenById(almacenId){
        return fetch(API_BASE_URL + '/' + almacenId);
    }
    updatealmacen( almacenId,almacen){
        return axios.put(API_BASE_URL +'/'+almacenId, almacen,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletealmacen(almacenId){
        return axios.delete(API_BASE_URL + '/' + almacenId);
    }
}

export default new almacenService()