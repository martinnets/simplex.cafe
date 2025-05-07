

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/notadet";
class notadetService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getnotadet(){
        return fetch( API_BASE_URL ) 
    }
    createnotadet(notadet){
        return axios.post(API_BASE_URL, notadet,{
            headers: {'Content-Type': 'application/json'}
        })}
    getnotadetById(notadetId){
        return fetch(API_BASE_URL + '/' + notadetId);
    }
    updatenotadet( notadet){
        return axios.put(API_BASE_URL , notadet,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletenotadet(notadetId){
        return axios.delete(API_BASE_URL + '/' + notadetId);
    }
}

export default new notadetService()