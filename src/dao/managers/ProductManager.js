import fs from 'fs'

class ProductManager{
    constructor(){
        this._products = []
        this._id = 1
        this._path = './dataBase/productos.json'
        this._format = 'utf-8'
    }

    fileContent = async (path, format) => {
        try{
            const fileContent = await fs.promises.readFile(path, format)
            const result = JSON.parse(fileContent)
            return result
        }
        catch (error){
            return console.error('HA OCURRIDO UN ERROR EN "fileContent', error)
        }
    }

    lastId = async () => {
        try{
            const fileContent = await this.fileContent(this._path, this._format)
            const maxId = fileContent.reduce((max, product) => {
                return product.id > max ? product.id : max
            }, 0)
            return maxId
        }
        catch (error){
            return console.error('HA OCURRIDO UN ERROR EN "lastId"', error)
        }
    }
    
    addProduct = async ({title, description, price, thumbnail, code, category, stock, status}) => {
        try{
            const newProduct = {
                title,
                description,
                price,
                thumbnail,
                code,
                category,
                stock,
                status
            }

            const excludedProperties = ['thumbnail']

            if (Object.keys(newProduct).some(campo => !newProduct[campo] && !excludedProperties.includes(campo))) return { success: false, status: 400, message: `addProduct: ${title} - incomplete` }      
    
            if (!fs.existsSync(this._path)){
                await this.getProducts()
            }else{
                this._id = await this.lastId() + 1
            }
    
            this._products = await this.fileContent(this._path, this._format)
    
            if (this._products.some(product => product.code === code)) return {success: false, status: 400, message: `The product "${title}" has the same code as another product("${code}")`}
    
            this._products.push({
                id: this._id,
                ...newProduct
            })
    
            await fs.promises.writeFile(this._path, JSON.stringify(this._products, null, 2), this._format)
    
            await this.getProducts()
            return {success: true, status: 200, message: 'Se agrego correctamente el producto'}
        }
        catch (error){
            return console.error('HA OCURRIDO UN ERROR EN "addProduct"', error)
        }
    }
    
    getProducts = async () => {
        try{
            if (fs.existsSync(this._path)){
                this._products = await this.fileContent(this._path, this._format)
                return this._products
            }else{
                return fs.promises.writeFile(this._path, '[]', this._format)
            }
        }
        catch (error){
            return console.error('HA OCURRIDO UN ERROR EN "getProducts"', error)
        }
    }

    getProductById = async (id) => {
        try{
            this._products = await this.fileContent(this._path, this._format)
            const foundProduct = this._products.find(product => product.id === id)
            return foundProduct
        }
        catch (error){
            console.error('HA OCURRIDO UN ERROR EN "getProductById"', error)
        }
    }

    updateProduct = async (id, property) => {
        try{
            this._products = await this.fileContent(this._path, this._format)
            const foundProduct = this._products.findIndex(product => product.id === id)
            if (foundProduct !== -1){
                if ('id' in property){
                    delete property.id
                    return {success: false, status: 400, message: 'Modifying the ID directly is not allowed'}
                }

                if ('code' in property){
                    const newCode = property.code
                    const exists = this._products.some(product => product.code === newCode)
                    if(exists) return {success: false, status: 400, message: `this code (${newCode})is ocuppied`}
                }

                this._products[foundProduct] = Object.assign({}, this._products[foundProduct], property)
                await fs.promises.writeFile(this._path, JSON.stringify(this._products, null, 2), this._format)

                return {success: true, status: 200, message: 'Se actualizo correctamente el producto'}
            }else{
                if(id <= 0) return {success: false, status: 400, message: 'Id has to be above 0'}
                if(id > this._products.length) return {success: false, status: 400, message: `ID is above the number of products (${this._products.length})`}
                if(isNaN(id)) return {success: false, status: 400, message: 'Id has to be a number'}
                console.error(`\nupdateProduct: Not Found\n`)
            }
        } catch (error){
            console.error(error)
        }
    }

    deleteProduct = async (id) => {
        try{
            const deletedProduct = this._products.find(products => products.id === id)
            if(deletedProduct){
                this._products = await this.fileContent(this._path, this._format)
                const productToDelete = this._products.filter(products => products.id !== id)
                await fs.promises.writeFile(this._path, JSON.stringify(productToDelete, null, 2))
                await this.getProducts()
                return {success: true, status: 200, message: 'Se elimino correctamente el producto'}
            }else{
                if(id <= 0) return {success: false, status: 400, message: 'Id has to be above 0'}
                if(id > this._products.length) return {success: false, status: 400, message: `ID is above the number of products (${this._products.length})`}
                if(isNaN(id)) return {success: false, status: 400, message: 'Id has to be a number'}
                console.error(`\ndeleteProduct: Not Found\n`)
            }
        }
        catch (error){
            console.error('HA OCURRIDO UN ERROR EN "deleteProduct"', error)
        }
    }
}

export default ProductManager