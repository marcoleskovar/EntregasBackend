import moment from "moment"
export default class TicketDTO {
    constructor (file) {
        this.id = file?.id ?? `auto-dto-id_${Math.random().toString(32).substring(7)}`
        this.code = file?.code ?? Math.random().toString(32).substring(7)
        this.purchase_datetime =  file?.purchase_datetime ?? moment().format("DD-MM-YYYY - hh:mm a")
        this.totalAmount = file?.totalAmount ?? 0
        this.products =  file?.products ?? [],
        this.purchaser = file?.purchaser ?? ''
    }
}