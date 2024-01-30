import CartModel from "./models/cart.model.js"
import TicketModel from "./models/ticket.model.js"

export default class Cart {
    constructor () {this.model = CartModel}
    async getCarts () {return this.model.find().lean()}
    async getCartById (id) {return this.model.findOne({_id: id}).lean()}
    async createCart (data) {return this.model.create(data)}
    async updateCart ({ query, update, options }) {return this.model.findOneAndUpdate(query, update, options)}
    async deleteCart (id) {return this.model.deleteOne({_id: id})}
    async purchaseCart (data) {return TicketModel.create(data)}
}