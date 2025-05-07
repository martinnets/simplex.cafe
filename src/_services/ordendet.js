

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/ordendet";
class ordendetService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getordendet(){
        return fetch( API_BASE_URL ) 
    }
    createordendet(ordendet){
        return axios.post(API_BASE_URL, ordendet,{
            headers: {'Content-Type': 'application/json'}
        })}
    getordendetById(ordendetId){
        return fetch(API_BASE_URL + '/' + ordendetId);
    }
    updateordendet( ordendet){
        return axios.put(API_BASE_URL , ordendet,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteordendet(ordendetId){
        return axios.delete(API_BASE_URL + '/' + ordendetId);
    }
}

export default new ordendetService()