import { Ordendet } from "./ordendet"
import { Personal } from "./personal"
import { Proveedor } from "./proveedor"

export interface Orden {
    empresaId?:string
    _id?:string  
        orden?:number
        fecha?:string
        proveedorID?:string
        proveedor?:Proveedor[]
        compradorID?:string
        comprador?:Personal[]
        detalle?:object
        subtotal?:number
        igv?:number
        total?:number
        moneda?:string
        condicionpago?:string
        codigo_estado?:string
        usu_crea?:string
        fec_crea?:Date
        usu_modi?:string
        fec_modi?:Date
}