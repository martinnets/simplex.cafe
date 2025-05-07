

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/lead";
class leadService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getlead(id){
        return fetch( API_BASE_URL +'/todo/'+id ) 
    }
    createlead(lead){
        return axios.post(API_BASE_URL, lead,{
            headers: {'Content-Type': 'application/json'}
        })}
    getleadById(leadId){
        return fetch(API_BASE_URL + '/' + leadId);
    }
    updatelead( id,lead){
        return axios.put(API_BASE_URL +'/'+id, lead,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletelead(leadId){
        return axios.delete(API_BASE_URL + '/' + leadId);
    }
}

export default new leadService()