import moment from "moment"
import { ProductService } from "./service.js"
import { error, success } from "../utils.js"

export default class CartRepository {
    constructor (dao) {
        this.dao = dao
        this.area = 'cartRepository'
    }
    
    //ALL CARTS
    async getCarts () {
        const carts = await this.dao.getCarts()

        return await success('Se han encontrado correctamente los carritos', carts, this.area)
    }

    //SPECIFIC CART
    async getCartById (id) {
        if (id <= 0) return await error('ID has to be above 0', 400, this.area)
        
        const cartById = await this.dao.getCartById(id)

        if (cartById === null) return await error( 'CartID not found', 404, this.area)
        else return await success('El carrito se encontro correctamente', cartById, this.area)//{id, products: prodArray}
    }

    //POST CART
    async createCart (data) {
        const create = await this.dao.createCart(data)
        
        if(!create) return await error('No se ha creado correctamente el carrito', 500, this.area)
        else return await success('Se ha creado correctamente el carrito', create, this.area)
    }

    //ADD PRODUCT TO CART
    async addToCart (cid, productData, user) {//CHECK-DONE
        const cart = await this.getCartById(cid)
        
        if(!cart.success) return cart

        if (productData.owner === user.email) return await error ('No podes agregar tus propios productos al carro', 400, this.area)

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

        return await success('Se ha agregado correctamente el producto al carrito', productData, this.area)
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

        if (!result) return await error('No se ha modificado correctamente el carrito', 500, this.area)
        return await success('Se ha modificado correctamente el carrito', result, this.area)
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
        if(!cartModified) return await error('No se ha modificado correctamente el carrito', 500, this.area)
        else return await success('Se ha modificado correctamente el carrito', cartModified, this.area)
    }

    //DELETE CART
    async deleteCart (id) {
        const exist = await this.getCartById(id)

        if (!exist.success) return exist

        const cart = await this.dao.deleteCart(id)

        if (cart.deletedCount > 0) return await success('Se ha eliminado correctamente el carrito', exist.result, this.area)
        else return await error('No se ha eliminado correctamente el carrito', 500, this.area)
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
        
        if(!cartModified) return await error('No se ha eliminado correctamente el producto del carrito', 500, this.area)
        else return await success('Se ha eliminado correctamente el producto del carrito', cartModified, this.area)
    }

    async purchaseCart (cid, user) {
        const cart = await this.getCartById(cid)
        if (!cart.success) return cart

        const prodInfo = []
        const purchaser = user
        const validProds = cart.result.products.filter(p => {
            if (p.product.stock >= p.quantity){
                prodInfo.push({product: p.product.title, price: p.product.price, quantity: p.quantity, subtotal: (p.product.price *  p.quantity)})
                return p
            }
        })

        if (validProds.length !== 0) {
            const ticket = {
                products: prodInfo,
                totalAmount: validProds.reduce((acumulator, prod) => {  
                    return acumulator + (prod.product.price) * prod.quantity
                }, 0),
                purchaser
            }

            const purchase = await this.dao.purchaseCart(ticket)

            if (!purchase) return await error('No se ha podido hacer la compra', 500, this.area)

            for (const p of await validProds) {
                const updated =  await ProductService.updateProduct(p.product._id || p.product.id, { stock: p.product.stock - p.quantity })
                if (!updated.success) return updated
                
                const deleted = await this.deleteProdCart(cid, p.product._id || p.product.id)
                
                if (!deleted.success) return deleted
            }
            return await success ('Se ha borrado del carrito correctamente', 'All good', this.area)
        }else {
            return await error ('Not Valid Products', 400, this.area)
        }
    }
}