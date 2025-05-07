export interface Ordendet {
    empresaId?:string
    ordenId?:string
    _id?:string  
        orden?:string
        productoId?:string
        producto?:string
        cantidad?:number
        precio_unitario?:number
        subtotal?:number
        igv?:number
        total?:number
        codigo_estado?:string
        usu_crea?:string
        fec_crea?:Date
        usu_modi?:string
        fec_modi?:Date
}