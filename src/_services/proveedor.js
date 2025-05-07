

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/proveedor";
class proveedorService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getproveedor(id){
        return fetch( API_BASE_URL +'/todo/'+id) 
    }
    createproveedor(proveedor){
        return axios.post(API_BASE_URL, proveedor,{
            headers: {'Content-Type': 'application/json'}
        })}
    getproveedorById(proveedorId){
        return fetch(API_BASE_URL + '/' + proveedorId);
    }
    updateproveedor(proveedorId, proveedor){
        return axios.put(API_BASE_URL +'/'+proveedorId, proveedor,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteproveedor(proveedorId){
        return axios.delete(API_BASE_URL + '/' + proveedorId);
    }
}

export default new proveedorService()