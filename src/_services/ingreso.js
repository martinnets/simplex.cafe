

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API_URL+"/ingreso";
class ingresoService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getingreso(id){
        return fetch( API_BASE_URL +'/todo/'+id) 
    }
    getingresotop(id){
        return fetch( API_BASE_URL +'/top/'+id) 
    }
    getingresokpi(reporte){
        return axios.post( API_BASE_URL +'/kpi',reporte) 
    }
    getingresocorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    createingreso(ingreso){
        return axios.post(API_BASE_URL, ingreso,{
            headers: {'Content-Type': 'application/json'}
        })}
    reportexdia(ingreso){
        return axios.post(API_BASE_URL+'/dia', ingreso )}
    reporteingreso(ingreso){
        return axios.post(API_BASE_URL+'/rep', ingreso )}
    reporteingresopago(ingreso){
        return axios.post(API_BASE_URL+'/pago', ingreso )}
    getingresoById(ingresoId){
        return fetch(API_BASE_URL + '/' + ingresoId);
    }
    updateingreso( id,ingreso){
        return axios.put(API_BASE_URL +'/'+id, ingreso,{
            headers: {'Content-Type': 'application/json'}
        }) }
    updateingresonota(id){
        return axios.put(API_BASE_URL +'/nota/'+id,{
            headers: {'Content-Type': 'application/json'}
        }) }        
    deleteingreso(ingresoId){
        return axios.delete(API_BASE_URL + '/' + ingresoId);
    }
}

export default new ingresoService()