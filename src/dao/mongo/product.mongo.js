import ProductsModel from "../models/product.model.js"

export default class Product {
    constructor () {this.model = ProductsModel}
    async getProducts () {return this.model.find().lean()}//CHECK
    async getProductById (id) {return this.model.findOne({_id: id}).lean()}//CHECK
    async createProduct (data) {return this.model.create(data)}//CHECK
    async updateProduct ({query, update, options}) {return this.model.findOneAndUpdate(query, update, options)}
    async deleteProduct (id) {return this.model.deleteOne({_id: id})}//CHECK
    async paginateProducts ({options}) {return this.model.paginate(options)}
}