export default class CurrentDTO {
    constructor (file) {
        this.name = file?.name || ''
        this.lastname =  file?.lastname ?? ''
        this.email =  file?.email ?? 'errorEmail'
        this.username =  file?.username ?? 'errorUsername'
        this.age =  file?.age ?? 1
        this.gender = file?.gender ?? ''
        this.role = file?.role ?? 'user'
    }
}