import UserModel from "../models/model.user.js"

export default class User {
    constructor() {this.model = UserModel}
    async getUsers () {return this.model.find().lean()}
    async getUserByID (id) {return this.model.findById(id)}
    async createUser (user) {return this.model.create(user)}
}