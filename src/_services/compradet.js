

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/compradet";
class compradetService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getcompradet(){
        return fetch( API_BASE_URL ) 
    }
    createcompradet(compradet){
        return axios.post(API_BASE_URL, compradet,{
            headers: {'Content-Type': 'application/json'}
        })}
    getcompradetById(compradetId){
        return fetch(API_BASE_URL + '/' + compradetId);
    }
    updatecompradet( compradet){
        return axios.put(API_BASE_URL , compradet,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletecompradet(compradetId){
        return axios.delete(API_BASE_URL + '/' + compradetId);
    }
}

export default new compradetService()