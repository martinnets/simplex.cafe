export interface Compradet {
    empresaId?:string
    _id?:string  
    compraId?:string,
    productoId?:string
    producto?:string
    cantidad?:number
    precio_unitario?:number
    subtotal?:number
    igv?:number
    total?:number
    compra?:string
    codigo_estado?:string
    usu_crea?:string
    fec_crea?:Date
    usu_modi?:string
    fec_modi?:Date
}