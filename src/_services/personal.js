

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/personal";
class personalService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getpersonal(id){
        return fetch( API_BASE_URL  +'/todo/'+id) 
    }
    getpersonalByPuesto(puesto){
        return axios.post( API_BASE_URL +'/puesto',puesto) 
    }
    createpersonal(personal){
        return axios.post(API_BASE_URL, personal,{
            headers: {'Content-Type': 'application/json'}
        })}
    getpersonalById(personalId){
        return fetch(API_BASE_URL + '/' + personalId);
    }
    updatepersonal( personalId,personal){
        return axios.put(API_BASE_URL +'/'+personalId, personal,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletepersonal(personalId){
        return axios.delete(API_BASE_URL + '/' + personalId);
    }
}

export default new personalService()