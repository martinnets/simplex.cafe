export interface Almacen {
    empresaId?:string
    _id?:string  
        name?:string
        contentType?:string
        imageId?:string
        content?:{
            Data:Buffer,
            contentType?:string
        }
        codigo_estado?:string
        usu_crea?:string
        fec_crea?:Date
        usu_modi?:string
        fec_modi?:Date
}