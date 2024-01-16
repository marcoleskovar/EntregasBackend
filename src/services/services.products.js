import ProductsModel from "../dao/models/model.products.js"

class ProductsService {
    constructor(){
        this.model = ProductsModel
    }

    async getAllProducts (limit) {//CHECK-DONE
        const products = await this.model.find().lean()

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

    async getProductById (id) {//CHECK-DONE
        if(id <= 0) return {success: false, area: 'Service', tryError: 'ID has to be above 0', status: 400}
        
        const productById = await this.model.findOne({_id: id}).lean()

        if (productById === null) return {success: false, area: 'Service', tryError: 'ProductID not found', status: 404}
        else return {success: true, producto: productById}
    }

    async postProduct (data) {//CHECK-DONE
        const addProduct = await this.model.create(data)
        
        if(addProduct) return {success: true,  message: 'Se ha agregado correctamente el producto', producto: addProduct}
        else return {success: false, area: 'Service', tryError: 'No se ha agregado correctamente el producto', status: 400}     
    }

    async updateProduct (id, data) {//CHECK-DONE
        const prodDefault = await this.getProductById(id)

        if (!prodDefault.success) return prodDefault

        const prodModified = await this.model.findOneAndUpdate({_id: id}, data, {new: true})

        if(prodModified){
            return {success: true, message: 'Se ha modificado correctamente el producto', before: prodDefault, after: prodModified}
        }else{
            return {success: false, area: 'Service', tryError: 'No se ha modificado correctamente el producto', status: 400}
        }
    }

    async deleteProduct (id) {//CHECK-DONE
        const exist = await this.getProductById(id)

        if(!exist.success) return {success: false, area: 'Service', tryError: 'ID not found', status: 404}
        
        const deleteProduct = await this.model.deleteOne({_id: id})

        if(deleteProduct.deletedCount > 0) return {success: true, message: 'Se ha eliminado correctamente el producto'}
        else return {success: false, area: 'Service', tryError: 'No se ha eliminado correctamente el producto', status: 400}
    }
}
export default ProductsService