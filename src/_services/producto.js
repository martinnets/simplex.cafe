

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/producto";
class productoService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getproducto(id){
        return fetch( API_BASE_URL +'/todo/'+id) 
    }
    getproductokardex(id){
        return fetch( API_BASE_URL +'/kardex/'+id) 
    }
    createproducto(producto){
        return axios.post(API_BASE_URL, producto,{
            headers: {'Content-Type': 'application/json'}
        })}
    getproductoById(productoId){
        return fetch(API_BASE_URL + '/' + productoId);
    }
    updateproducto( productoId,producto){
        return axios.put(API_BASE_URL +'/'+productoId, producto,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteproducto(productoId){
        return axios.delete(API_BASE_URL + '/' + productoId);
    }
    getproductosearch(producto){
        return axios.post( API_BASE_URL+ '/search', producto) 
    }
}

export default new productoService()