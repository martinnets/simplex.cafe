

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/ventadet";
class ventadetService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getventadet(){
        return fetch( API_BASE_URL ) 
    }
    createventadet(ventadet){
        return axios.post(API_BASE_URL, ventadet,{
            headers: {'Content-Type': 'application/json'}
        })}
    getventadetById(ventadetId){
        return fetch(API_BASE_URL + '/' + ventadetId);
    }
    updateventadet( ventadet){
        return axios.put(API_BASE_URL , ventadet,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteventadet(ventadetId){
        return axios.delete(API_BASE_URL + '/' + ventadetId);
    }
}

export default new ventadetService()