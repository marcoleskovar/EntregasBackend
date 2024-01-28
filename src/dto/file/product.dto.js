export default class ProductDTO {
    constructor (file) {
        this.id = file?.id ?? `auto-dto-id_${Math.random().toString(32).substring(7)}`
        this.title = file?.title ?? ''
        this.description =  file?.description ?? ''
        this.price =  file?.price ?? 0
        this.thumbnail =  [file?.thumbnail] ?? []
        this.code = file?.code ?? Math.random().toString(32).substring(7)
        this.category =  file?.category ?? ''
        this.stock = file?.stock ?? 0
        this.status = file?.status ?? true
    }
}