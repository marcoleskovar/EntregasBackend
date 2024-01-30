import UserModel from "./models/user.model.js"

export default class User {
    constructor() {this.model = UserModel}
    async getUsers () {return this.model.find().lean()}
    async getById (id) {return this.model.findOne({_id: id})}
    async getByEmail (email) {return this.model.findOne({email: email})}
    async getByUsername (username) {return this.model.findOne({username: username})}
    async createUser (user) {return this.model.create(user)}
}