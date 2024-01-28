export default class UserDTO {
    constructor (file) {
        this.id = file?.id ?? `auto-dto-id_${Math.random().toString(32).substring(7)}`
        this.name = file?.name || ''
        this.lastname =  file?.lastname ?? ''
        this.email =  file?.email ?? 'errorEmail'
        this.username =  file?.username ?? 'errorUsername'
        this.password = file?.password ?? 'errorPassword'
        this.age =  file?.age ?? 1
        this.gender = file?.gender ?? ''
        this.role = file?.role ?? 'user'
        this.cart = file?.cart ?? 'errorCart'
    }
}