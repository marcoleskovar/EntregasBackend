import moment from "moment"
import { ProductService } from "./service.js"

export default class CartRepository {
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
        const result = {success: false, area: 'Cart-Service', tryError: message, status: status}
        return result
    }
    
    //ALL CARTS
    async getCarts () {
        const carts = await this.dao.getCarts()

        return await this.success('Se han encontrado correctamente los carritos', carts)
    }

    //SPECIFIC CART
    async getCartById (id) {
        if (id <= 0) return await this.error('ID has to be above 0', 400)
        
        const cartById = await this.dao.getCartById(id)

        if (cartById === null) return await this.error( 'CartID not found', 404)
        else return await this.success('El carrito se encontro correctamente', cartById)//{id, products: prodArray}
    }

    //POST CART
    async createCart (data) {
        const create = await this.dao.createCart(data)
        
        if(!create) return await this.error('No se ha creado correctamente el carrito', 400)
        else return await this.success('Se ha creado correctamente el carrito', create)
    }

    //ADD PRODUCT TO CART
    async addToCart (cid, productData) {//CHECK-DONE
        const cart = await this.getCartById(cid)
        
        if(!cart.success) return cart

        const updateQuery = {
            query: {_id: cid, "products.product": productData._id || productData.id},
            update: {$inc: {"products.$.quantity": 1}},
            options: {new: true, method: 'plus_one' }
        }
        const result = await this.dao.updateCart(updateQuery)

        if(!result) {
            const cartUpdateQuery = {
                query: { _id: cid },
                update: {
                    $push: {
                        products: {
                            product: productData._id || productData.id,
                            quantity: 1,
                        },
                    },
                },
                options: {new: true, method: 'create'}
            }
            await this.dao.updateCart(cartUpdateQuery)
        }

        return await this.success('Se ha agregado correctamente el producto al carrito', productData)
    }

    //CHANGE CART
    async updateCart(cid, data) {//CHECK
        const cart = await this.getCartById(cid)
        
        if (!cart.success) return cart

        const toUpdate = data.map(item => ({
            product: item.product,
            quantity: item.quantity || 1
        }))

        const cartUpdateQuery = {
            query: { _id: cid },
            update: {
                $set: {
                    products: toUpdate,
                },
            },
            options: { new: true, upsert: true, method: 'update'},
        }
        const result = await this.dao.updateCart(cartUpdateQuery)

        if (!result) return await this.error('No se ha modificado correctamente el carrito', 400)
        return await this.success('Se ha modificado correctamente el carrito', result)
    }

    
    //UPDATE PRODUCT QUANTITY
    async updateCartQuant (cid, pid, data) {//CHECK-DONE
        const cart = await this.getCartById(cid)

        if (!cart.success) return cart

        const cartUpdateQuery = {
            query: {_id: cid, "products.product": pid},
            update: {$set: {"products.$.quantity": data}},
            options: {new: true, method: 'free_quantity'}
        }

        const cartModified = await this.dao.updateCart(cartUpdateQuery)
        if(!cartModified) return await this.error('No se ha modificado correctamente el carrito', 400)
        else return await this.success('Se ha modificado correctamente el carrito', cartModified)
    }

    //DELETE CART
    async deleteCart (id) {
        const exist = await this.getCartById(id)

        if (!exist.success) return exist

        const cart = await this.dao.deleteCart(id)

        if (cart.deletedCount > 0) return await this.success('Se ha eliminado correctamente el carrito', exist.result)
        else return await this.error('No se ha eliminado correctamente el carrito', 400)
    }

    //DELETE PRODUCT FROM CART
    async deleteProdCart (cid, pid) {
        const cart = await this.getCartById(cid)

        if (!cart.success) return cart

        const cartUpdateQuery = {
            query: {_id: cid},
            update: {$pull: {products: {product: pid}}},
            options: {new: true, method: 'delete'}
        }

        const cartModified = await this.dao.updateCart(cartUpdateQuery)
        
        if(!cartModified) return await this.error('No se ha eliminado correctamente el producto del carrito', 400)
        else return await this.success('Se ha eliminado correctamente el producto del carrito', cartModified)
    }

    async purchaseCart (cid, user) {
        const cart = await this.getCartById(cid)

        if (!cart.success) return cart

        const validProds = []
        const rejectedProds = []
        const prodInfo = []
        const code = Math.random().toString(32).substring(7)
        const purchase_datetime = moment().format("DD-MM-YYYY - hh:mm a")
        const purchaser = user

        for (const p of cart.result.products) {
            const stock = p.product.stock
            const quantity = p.quantity
            
            if (stock >= quantity) {
                validProds.push(p)
                prodInfo.push({product: p.product.title, price: p.product.price, quantity: p.quantity, subtotal: (p.product.price *  p.quantity)})
            }else {
                rejectedProds.push(p)
            }
        }

        if (validProds.length !== 0) {
            const ticket = {
                code,
                purchase_datetime,
                products: prodInfo,
                totalAmount: validProds.reduce((acumulator, prod) => {  
                    return acumulator + (prod.product.price) * prod.quantity
                }, 0),
                purchaser
            }
    
            const purchase = await this.dao.purchaseCart(ticket)
            if (purchase) {
                const updateProcess = validProds.map( async (p) => {
                    const newStock = (p.product.stock - p.quantity)
                    const updateStock = await ProductService.updateProduct(p.product._id || p.product.id, {stock: newStock})
                    return updateStock
                })
                const updateResult = await Promise.all(updateProcess)

                const deleteProcess = validProds.map(async (p, index) => {
                    if (updateResult[index].success) {
                        const deleteFunc = await this.deleteProdCart(cid, p.product._id || p.product.id)
                        return deleteFunc
                    } else {
                        return updateResult[index]
                    }
                })
                const deleteResults = await Promise.all(deleteProcess)

                const successResults = deleteResults.filter(result => result && result.success)
                
                if (successResults.length === validProds.length) return this.success('Se ha comprado correctamente el carrito', purchase)
                else return this.error('Hubo un problema en algunas operaciones', 500)
            }else {
                return await this.error('No se ha podido hacer la compra', 500)
            }
        }else {
            return await this.success ('No hay productos validos, modifica sus quantitys', 'notValid')
        }
    }
}