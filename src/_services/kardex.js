

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/kardex";
class kardexService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getkardex(id){
        return fetch( API_BASE_URL +'/todo/'+id) 
    }
    getkardexstock(id){
        return fetch( API_BASE_URL +'/stock/'+id) 
    }
    createkardex(kardex){
        return axios.post(API_BASE_URL, kardex,{
            headers: {'Content-Type': 'application/json'}
        })}
    getkardexById(kardexId){
        return fetch(API_BASE_URL + '/' + kardexId);
    }
    kardexReporteKPI(kardex){
        return axios.post(API_BASE_URL + '/kpi' , kardex);
    }
    updatekardex(kardexId, kardex){
        return axios.put(API_BASE_URL +'/'+kardexId, kardex,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletekardex(kardexId){
        return axios.delete(API_BASE_URL + '/' + kardexId);
    }
}

export default new kardexService()