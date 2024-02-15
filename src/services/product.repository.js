import ViewsManager from "../dao/file/managers/ViewsManager.js"
import { success, error } from "../utils.js"

export default class ProductRepository {
    constructor (dao) {
        this.dao = dao
        this.views = new ViewsManager()
        this.area = 'productRepository'
    }
    
    //ALL PRODUCTS
    async getProducts (limit) {//CHECK
        const products = await this.dao.getProducts()

        if (limit){
            if (!isNaN(limit) && limit > 0){
                if(limit > products.length) return await error(`limit is above the number of products (${products.length})`, 404, this.area)
                
                const sliceProducts = products.slice(0, limit)
                return await success('Se han encontrado correctamente los productos', sliceProducts, this.area)
            }else{
                if(isNaN(limit)) return await error('limit has to be a number', 400, this.area)
                else return await error('limit has to be above 0', 400, this.area)
            }
        }else
        return await success('Se han encontrado correctamente los productos', products, this.area)
    }

    //SPECIFIC PRODUCT
    async getProductById (id) {//CHECK
        if (id <= 0) return await error('ID has to be above 0', 400, this.area)
        
        const productById = await this.dao.getProductById(id)

        if (productById === null) return await error( 'ProductID not found', 404, this.area)
        else return await success('El producto se encontro correctamente', productById, this.area)
    }

    //POST PRODUCT
    async createProduct (data) {//CHECK
        const create = await this.dao.createProduct(data)
        
        if(!create) return await error('No se ha creado correctamente el producto', 400, this.area)
        else return await success('Se ha creado correctamente el producto', create, this.area)
    }
    
    //CHANGE PRODUCT
    async updateProduct (id, data) {//CHECK
        const oldProduct = await this.getProductById(id)

        if (!oldProduct.success) return oldProduct

        const toUpdate = {
            query: {_id: id},
            update: {$set: data},
            options: {new: true}
        }
        const newProduct = await this.dao.updateProduct(toUpdate)

        if (!newProduct) return await error('No se ha modificado correctamente el producto', 400, this.area)
        else return await success('Se ha modificado correctamente el producto', newProduct, this.area)
    }

    //ERASE PRODUCT
    async deleteProduct (id) {//CHECK
        const exist = await this.getProductById(id)

        if (!exist.success) return exist

        const product = await this. dao.deleteProduct(id)

        if (product.deletedCount > 0) return await success('Se ha eliminado correctamente el producto', exist.result, this.area)//LE AGREGAMOS EL .RESULT
        else return await error('No se ha eliminado correctamente el producto', 400, this.area)
    }

    async queryParams (req) {
        const query = await this.views.queryParams(req)
        const paginate = await this.dao.paginateProducts ({options: query})
        return paginate
    }
}