import fs from 'fs'
import ProductManager from './ProductManager.js'

const productManager = new ProductManager()

class CartManager{
    constructor(){
        this._products = []
        this._id = 1
        this._path = './dataBase/carrito.json'
        this._format = 'utf-8'
    }

    CartContent = async (path, format) => {
        try{
            const cartContent = await fs.promises.readFile(path, format)
            const result = JSON.parse(cartContent)
            return result
        }
        catch (error){
            return console.error('HA OCURRIDO UN ERROR EN CartContent', error)
        }
    }

    lastId = async () => {
        try{
            const CartContent = await this.CartContent(this._path, this._format)
            const maxId = CartContent.reduce((max, product) => {
                return product.id > max ? product.id : max
            }, 0)
            return maxId
        }
        catch (error){
            return console.error('HA OCURRIDO UN ERROR EN lastId', error)
        }
    }

    createCart = async (product) => {
        try{
            let exist = false

            if (!fs.existsSync(this._path)){
                await this.getCart()
            }else{
                this._id = await this.lastId() + 1
                exist = true
            }

            this._products = await this.CartContent(this._path, this._format)
            this._products.push({
                id: this._id,
                products: (product = [])
            })

            await fs.promises.writeFile(this._path, JSON.stringify(this._products, null, 2), this._format)
            await this.getCart()

            if(!exist) return {success: true, status: 200, message: "Se creo 'carrito.json' y se agrego un producto al cart"}

            return {success: true, status: 200, message: 'Se agrego un producto al cart'}
        }
        catch(error){
            return {success: false, status: 500, message: error.message}
        }
    }

    getCart = async () => {
        try{
            if (fs.existsSync(this._path)){
                this._products = await this.CartContent(this._path, this._format)
                return this._products
            }else{
                return fs.promises.writeFile(this._path, '[]', this._format)
            }
        }
        catch (error){
            console.error('HA OCURRIDO UN ERROR EN "getCart"', error)
            return []
        }
    }

    addToCart = async (cid, pid) =>{
        try{
            const foundInCart = await this.getProductById(cid)
            const foundInProducts = await productManager.getProductById(pid)
    
            if(!foundInProducts) return {success: false, status: 404, message: 'PID not found'}
            if(!foundInCart) return {success: false, status: 404, message: 'CID not found'}
    
            const product = foundInCart.products.find(p => p.products === pid)
    
            if(!product){
                foundInCart.products.push({product: pid, quantity: 1})
            }else{
                product.quantity++
            }

            await fs.promises.writeFile(this._path, JSON.stringify(this._products, null, '\t'))
            return {success: true, status: 200, message: 'Lo agregaste correctamente'}
        } catch (error) {
            console.error('Error in addToCart:', error)
            return { success: false, status: 500, message: 'Internal Server Error' }
        }
    }
    
    
    getProductById = async (id) => {
        try{
            this._products = await this.CartContent(this._path, this._format)
            const foundProduct = this._products.find(product => product.id === id)
            return foundProduct
        }
        catch (error){
            return {success: false, status: 500, message: error.message}
        }
    }
}

export default CartManager