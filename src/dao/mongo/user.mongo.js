import UserModel from "../models/model.user.js"

export default class User {
    constructor() {this.model = UserModel}
    async getUsers () {return this.model.find().lean()}
    async getUserById (id) {return this.model.findOne({_id: id})}
    async getUserByEmail (email) {return this.model.findOne({email: email})}
    async getUserByUsername (username) {return this.model.findOne({username: username})}
    async createUser (user) {return this.model.create(user)}
}