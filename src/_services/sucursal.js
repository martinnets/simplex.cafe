

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/sucursal";
class sucursalService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getsucursal(empresaId){
        return fetch( API_BASE_URL +'/todo/'+empresaId) 
    }
    createsucursal(sucursal){
        return axios.post(API_BASE_URL, sucursal,{
            headers: {'Content-Type': 'application/json'}
        })}
    getsucursalById(sucursalId){
        return fetch(API_BASE_URL + '/' + sucursalId);
    }
    updatesucursal( sucursalId,sucursal){
        return axios.put(API_BASE_URL +'/'+sucursalId, sucursal,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletesucursal(sucursalId){
        return axios.delete(API_BASE_URL + '/' + sucursalId);
    }
}

export default new sucursalService()