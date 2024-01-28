import fs from 'fs'
import ProductManager from './ProductManager.js'

class CartManager{
    constructor(){
        this._products = []
        this.filename = './dao/file/dataBase/carts.json'
        this._format = 'utf-8'
        this.prodManager = new ProductManager()
    }

    lastId = async () => {
        try{
            const list = await this.getCarts()
            const maxId = list.reduce((max, product) => {
                return product.id > max ? product.id : max
            }, 0)
            return maxId
        }
        catch (error){
            throw new Error ('No se ha generado un ID')
        }
    }

    prodById = async (id) => {
        const result = await this.prodManager.getProductById(id)
        return result
    }

    keyValue = async (obj, method) => {
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                if (method === 'plus_one' || method === 'free_quantity') return {success: true, result: 'quantity', quantity: obj[key]['products.$.quantity']}
                else if (method === 'update') return {success: true, result: 'update', content: obj[key]}
                else if (method === 'create') return {success: true, result: 'create', pid: obj[key].products.product, content: obj[key]}
                else if (method === 'delete') return {success: true, result: 'delete', pid: obj[key].products.product, content: obj[key]}
            }
        }
        return false
    }

    fileContent = async (path, format) => {//CHECK
        const list = await fs.promises.readFile(path, format)
        const parse = JSON.parse(list)
        
        if (!Array.isArray(parse)) throw new Error ('La dataBase tiene un formato erroneo')
        
        return parse
    }

    getCarts = async () => {//GET CARTS
        if (fs.existsSync(this.filename)){
            this._products = await this.fileContent(this.filename, this._format)
            return this._products
        }else{
            await fs.promises.writeFile(this.filename, '[]', this._format)
            return this._products
        }
    }

    getCartById = async (id) => {//GET CART BY ID
        const list = await this.getCarts()
        const find = list.findIndex(d => d.id === parseInt(id))

        if (find === -1) return null

        const pid = list[find].products.map(d => d.product)
        const prodQuant = list[find].products.map(d => d.quantity)
        const prodArray = []

        for (let i = 0; i < pid.length; i++){
            const prodByID = await this.prodById(pid[i])
            const result = {product: prodByID, quantity: prodQuant[i]}
            prodArray.push(result)
        }

        if (find !== -1) return {id, products: prodArray}
        else return null
    }

    createCart = async (data) => {//CREATE EMPTY CART
        const list = await this.getCarts()
        const id = await this.lastId() + 1
        const pushear = list.push({id, products: []})

        if (!pushear) return null

        const write = await fs.promises.writeFile(this.filename, JSON.stringify(list, null, 2))

        if(write === undefined) return ({id, products: []})
        else return null
    }

    addToCart = async (cid, pid) => {//ADD NEW PRODUCT TO CART
        const list = await this.getCarts()
        const idx = list.findIndex(d => d.id === parseInt(parseInt(cid)))
        list[idx].products.push({product: pid, quantity: 1})
        const write = await fs.promises.writeFile(this.filename, JSON.stringify(list, null, 2))

        if(write === undefined) return list
        else return null
    }

    updateCart = async ({query, update, options}) => {
        const key = await this.keyValue(update, options.method)
        const cid = query._id

        if (key.result === 'quantity') {// INCREASEQUANT(+1 PRODUCT QUANTITY / UPDATE CART QUANT)
            const pid = query["products.product"]
            const quant = key.quantity

            if (typeof (quant) !== 'number') throw new Error ('Quantity debe ser un numero')

            const method = options.method
            const increaseQuant = await this.increaseQuant(cid, pid, quant, method)
            return increaseQuant
        }
        else if (key.result === 'update') { //CHANGE WHOLE CART
            const list = await this.getCarts()
            const updtInfo = key.content.products
            const idx = list.findIndex(d => d.id === parseInt(parseInt(cid)))
            list[idx].products = updtInfo
            const write = await fs.promises.writeFile(this.filename, JSON.stringify(list, null, 2))
    
            if(write === undefined) return list[idx]
            else throw new Error ('No se ha podido modificar el carrito - Body recibe "[{"product": "productID"}]"')
        }
        else if (key.result === 'create') {//ADD NEW PRODUCT TO CART
            const pid = key.pid
            const addProduct = await this.addToCart(cid, pid)
            return addProduct
        }
        else if (key.result === 'delete') {
            const pid = key.pid
            const deleteSpecificProd = await this.deleteProdCart(cid, pid)
            return deleteSpecificProd
        }
    }

    increaseQuant = async (cid, pid, quant, method) => {
        const list = await this.getCarts()
        const idx = list.findIndex(d => d.id === parseInt(parseInt(cid)))
        const product = (list[idx].products.find(p => p.product === parseInt(pid)))

        if (!product) return null

        if (method === "plus_one") {//ADD TO CART
            product.quantity ++
        }else {//UPDATE CART QUANT
            product.quantity = quant
        }

        const write = await fs.promises.writeFile(this.filename, JSON.stringify(list, null, 2))
    
        if(write === undefined) return product
        else return null
    }

    deleteCart = async (id) => {
        const list = await this.getCarts()
        const newCarts = list.filter(d => d.id !== parseInt(id))

        const write = await fs.promises.writeFile(this.filename, JSON.stringify(newCarts, null, 2))
    
        if (write === undefined) return {deletedCount: 1}
        else return {deletedCount: -1}
    }

    deleteProdCart = async (cid, pid) => {
        const list = await this.getCarts()
        const idx = list.findIndex(d => d.id === parseInt(parseInt(cid)))
        const eliminatedProduct = (list[idx].products.filter(p => p.product === parseInt(pid)))

        if (eliminatedProduct.length === 0) throw new Error ('El producto no existe en el carrito')

        list[idx].products = list[idx].products.filter(p => p.product !== parseInt(pid))
        const write = await fs.promises.writeFile(this.filename, JSON.stringify(list, null, 2))
    
        if (write === undefined) return eliminatedProduct
        else return  null
    }
}

export default CartManager