import fs from "fs"

class ProductManager{
    constructor(){
        this._products = []
        this._id = 1
        this._path = './productList.json'
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

            if (Object.keys(newProduct).some(field => !newProduct[field] && !excludedProperties.includes(field))) return { success: false, status: 400, message: `addProduct: ${title} - incomplete` }      
    
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
            console.log(`\nThe product "${title}" has been succesfully added:\n`)
    
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
                console.log(`\n===============LISTA DE PRODUCTOS===============\n`, this._products)
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
            console.log(`\n===============PRODUCTO ENCONTRADO===============\n`)
            return foundProduct ? foundProduct : console.error(`\ngetProductById: Not Found\n`)
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
                    console.error(`\nupdateProduct: Modifying the ID directly is not allowed\n`)
                    delete property.id
                }
                this._products[foundProduct] = Object.assign({}, this._products[foundProduct], property)
                console.log(`\n===============PRODUCTO MODIFICADO (ID: ${id})===============\n`)
                return await fs.promises.writeFile(this._path, JSON.stringify(this._products, null, 2), this._format)
            }else{
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
                console.log(`\n===============PRODUCTO ELIMINADO===============\n`, deletedProduct)
                return await this.getProducts()
            }else{
                console.error(`\ndeleteProduct: Not Found\n`)
            }
        }
        catch (error){
            console.error('HA OCURRIDO UN ERROR EN "deleteProduct"', error)
        }
    }
}
    
/* const productManager = new ProductManager */
    
/* 
const firstProduct = {
    title: 'Producto 1',
    description: 'Descripcion Producto 1',
    price: 1000,
    thumbnail: './img/prod-1.webp',
    code: 'A1',
    stock: 30,
}

const secondProduct = {
    title: 'Producto 2',
    description: 'Descripcion Producto 2',
    price: 200,
    thumbnail: './img/prod-1.webp',
    code: 'A2',
    stock: 4,
}

const thirdProduct = {
    title: 'Producto 3',
    description: 'Descripcion Producto 3',
    price: 4000,
    thumbnail: './img/prod-1.webp',
    code: 'A3',
    stock: 39,
}

const fourthProduct = {
    title: 'Producto 4',
    description: 'Descripcion Producto 4',
    price: 500,
    thumbnail: './img/prod-1.webp',
    code: 'A4',
    stock: 21,
} 
*/

    
/*
const run = async () => {
     
    await productManager.addProduct(firstProduct)
    await productManager.addProduct(secondProduct)
    await productManager.addProduct(thirdProduct)
    await productManager.addProduct(fourthProduct)
    //await productManager.getProductById(1)
    //await productManager.updateProduct(2, {id: 'X', title: 'PRODUCTO POST-MODIFICACION', price: 40})
    //await productManager.deleteProduct(3) 

}

    
run()
    .catch (error => console.error(error))
*/
export default ProductManager