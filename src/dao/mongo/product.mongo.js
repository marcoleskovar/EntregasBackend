import ProductsModel from "../models/model.products.js"

export default class Product {
    async getProducts () {return ProductsModel.find().lean()}//CHECK
    async getProductById (id) {return ProductsModel.findOne({_id: id}).lean()}//CHECK
    async createProduct (data) {return ProductsModel.create(data)}//CHECK
    async updateProduct (id, data) {return ProductsModel.findOneAndUpdate({_id: id}, data, {new: true})}//CHECK
    async deleteProduct (id) {return ProductsModel.deleteOne({_id: id})}//CHECK
}