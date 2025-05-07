export interface Pedidodet {
    empresaId?:string
    pedidoId?:string
    _id?:string  
        pedido?:string
        productoId?:string
        producto?:string
        cantidad?:number
        precio_unitario?:number
        subtotal?:number
        codigo_estado?:string
        usu_crea?:string
        fec_crea?:Date
        usu_modi?:string
        fec_modi?:Date
}