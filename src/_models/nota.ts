import { Cliente } from "./cliente"
import { Notadet } from "./notadet"
import { Personal } from "./personal"

export interface Nota {
    empresaId?:string
    _id?:string  
        nota?:number
        fecha?:string
        clienteId?:string
        almacenId?:string
        sucursalId?:string
        cliente?:Cliente[]
        detalle?:object
        personal?:Personal[]
        vendedor?:string
        total?:number
        cobrado?:number
        porcobrar?:number
        moneda?:string
        almacen?:string
        condicionpago?:string
        referencia?:string
        observacion?:string,
        kardex?:boolean,
        codigo_estado?:string
        usu_crea?:string
        fec_crea?:Date
        usu_modi?:string
        fec_modi?:Date
}