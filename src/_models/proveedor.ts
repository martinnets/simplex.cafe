import { Ordendet } from "./ordendet"
import { Personal } from "./personal"

export interface Proveedor {
    empresaId?:string
    _id?:string  
        tipo_doc?:string
        nro_doc?:string
        proveedor?:string
        direccion?:string
        ubigeo?:object
        telefono?:string
        email?:string
        web?:string
        codigo_estado?:string
        usu_crea?:string
        fec_crea?:Date
        usu_modi?:string
        fec_modi?:Date
}