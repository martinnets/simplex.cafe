export interface Oportunidad {
    empresaId?:string
    _id?:string  
    nombre?:string
    leadId?:string
    valor_estimado?:string
    probabilidad?:string
    fechaestimada?:string
    etapa_oportunidad?:string
    personalId?:string
    moneda?:string
    codigo_estado?:string
    usu_crea?:string
    fec_crea?:Date
    usu_modi?:string
    fec_modi?:Date
}