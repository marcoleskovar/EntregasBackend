export default class ProductRepository {
    constructor (dao) {
        this.dao = dao
    }

    //IF SUCCESS
    async success (message, data) {
        const result = {success: true, message: message, result: data}
        return result
    }

    //IF ERROR
    async error (message, status) {
        const result = {success: false, area: 'Product-Service', tryError: message, status: status}
        return result
    }
    
    //ALL PRODUCTS
    async getProducts (limit) {//CHECK
        const products = await this.dao.getProducts()

        if (limit){
            if (!isNaN(limit) && limit > 0){
                if(limit > products.length) return await this.error(`limit is above the number of products (${products.length})`, 404)
                
                const sliceProducts = products.slice(0, limit)
                return await this.success('Se han encontrado correctamente los productos', sliceProducts)
            }else{
                if(isNaN(limit)) return await this.error('limit has to be a number', 400)
                else return await this.error('limit has to be above 0', 400)
            }
        }else
        return await this.success('Se han encontrado correctamente los productos', products)
    }

    //SPECIFIC PRODUCT
    async getProductById (id) {//CHECK
        if (id <= 0) return await this.error('ID has to be above 0', 400)
        
        const productById = await this.dao.getProductById(id)

        if (productById === null) return await this.error( 'ProductID not found', 404)
        else return await this.success('El producto se encontro correctamente', productById)
    }

    //POST PRODUCT
    async createProduct (data) {//CHECK
        const create = await this.dao.createProduct(data)
        
        if(!create) return await this.error('No se ha creado correctamente el producto', 400)
        else return await this.success('Se ha creado correctamente el producto', create)
    }
    
    //CHANGE PRODUCT
    async updateProduct (id, data) {//CHECK
        const oldProduct = await this.getProductById(id)

        if (!oldProduct.success) return oldProduct

        const newProduct = await this.dao.updateProduct(id, data)

        if (!newProduct) return await this.error('No se ha modificado correctamente el producto', 400)
        else return await this.success('Se ha modificado correctamente el producto', newProduct)
    }

    //ERASE PRODUCT
    async deleteProduct (id) {//CHECK
        const exist = await this.getProductById(id)

        if (!exist.success) return exist

        const product = await this. dao.deleteProduct(id)

        if (product.deletedCount > 0) return await this.success('Se ha eliminado correctamente el producto', exist)
        else return await this.error('No se ha eliminado correctamente el producto', 400)
    }
}

