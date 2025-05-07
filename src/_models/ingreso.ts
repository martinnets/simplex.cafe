import { Nota } from "./nota"

export interface Ingreso {
    empresaId?:string
    _id?:string  
    ingreso?:number
    notaId?:string
    notas?:Nota[]
    correlativo?:string
    categoria?:string
    fecha?:string
    metodo_pago?:string
    tipo_doc_pago?:string
    num_doc?:string
    concepto?:string
    importe?:number
    almacenId?:string
    moneda?:string
    clienteId?:string
    cliente?:string
    observacion?:string
    ventaId?:string
    cuenta?:string
    codigo_estado?:string
    usu_crea?:string
    fec_crea?:Date
    usu_modi?:string
    fec_modi?:Date
}