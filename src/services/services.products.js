import ProductsModel from "../dao/models/model.products.js"
import mongoose from "mongoose"

class ProductsService {
    constructor(){
        this.model = ProductsModel
    }

    async getAllProducts (limit) {
        const products = await this.model.find().lean().exec()

        if (limit){
            if(!isNaN(limit) && limit > 0){
                if(limit > products.length) return {success: false, area: 'Service', tryError: `limit is above the number of products (${products.length})`, status: 404}
                const sliceProducts = products.slice(0, limit)

                return {success: true, productos: sliceProducts}
            }else{
                if(isNaN(limit)) return {success: false, area: 'Service', tryError: 'limit has to be a number', status: 400}
                else return {success: false, area: 'Service', tryError: 'limit has to be above 0', status: 400}
            }
        }
        return {success: true, productos: products}
    }

    async getById (id) {
        if(id <= 0) return ({success: false, area: 'Service', tryError: 'ID has to be above 0', status: 400})

        const toObjectId = new mongoose.Types.ObjectId(id)
        const productById = await this.model.findById(toObjectId).lean().exec()

        if (productById === null) return ({success: false, area: 'Service', tryError: 'ID not found', status: 404})

        return ({success: true, producto: productById})
    }

    async postProduct (data) {
        const addProduct = await this.model.create(data)
        if(addProduct) return {success: true,  message: 'Se ha agregado correctamente el producto', producto: addProduct}
        else return {success: false, area: 'Service', tryError: 'No se ha agregado correctamente el producto', status: 400}     
    }

    async updateProduct (id, data) {
        const toObjectId = new mongoose.Types.ObjectId(id)
        const prodDefault = await this.model.findById(toObjectId).lean().exec()
        const prodModified = await this.model.updateOne({_id: id}, toUpdate)
        if(prodModified){
            const prodNew = await this.model.findById(toObjectId).lean().exec()
            return {success: true, message: 'Se ha modificado correctamente el producto', before: prodDefault, after: prodNew}
        }else{
            return {success: false, area: 'Service', tryError: 'No se ha modificado correctamente el producto', status: 400}
        }
    }

    async deleteProduct (id) {
        const toObjectId = new mongoose.Types.ObjectId(id)
        const deleteProduct = await this.model.deleteOne({_id: toObjectId})
        if(deleteProduct) return {success: true, message: 'Se ha eliminado correctamente el producto'}
        else return {success: false, area: 'Service', tryError: 'No se ha eliminado correctamente el producto', status: 400}
    }
}
export default ProductsService