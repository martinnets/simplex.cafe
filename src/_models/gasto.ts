export interface Gasto {
    _id?:string  
        codigo?:string
        categoria?:string
        grupo?:string
        fecha?:string
        tipo_gasto?:string
        concepto?:string
        importe?:string
        moneda?:string
        proveedor?:string
        observacion?:string
        codigo_estado?:string
        usu_crea?:string
        fec_crea?:Date
        usu_modi?:string
        fec_modi?:Date
}