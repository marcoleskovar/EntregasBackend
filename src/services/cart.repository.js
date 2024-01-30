import moment from "moment"

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

    //PURCHASE CART
    async validToPurchase (cid) {
        const cart = await this.getCartById(cid)

        if (!cart.success) return cart

        const result = await Promise.all (cart.result.products.map(async (p) => {
            const stock = p.product.stock
            const quantity = p.quantity
            
            if (stock >= quantity) return await this.success('Stock mayor a cantidad', p)
            else return await this.error(p, 400)
        }))
        return result
    }

    async purchaseCart (cid, data, user) {
        const newTicket = {
            code: Math.random().toString(32).substring(7),
            purchase_datetime: moment().format("DD-MM-YYYY - hh:mm a"),
            amount: data.reduce((acumulator, product) => {  
                return acumulator + (product.product.price) * product.quantity
            }, 0),
            purchaser: user
        }
        const purchase = await this.dao.purchaseCart(newTicket)
        if (purchase) {
            data.map(async p => {
                const deleteFunc = await this.deleteProdCart(cid, p.product._id || p.product.id)
                if (!deleteFunc.success) return deleteFunc
            })
            return await this.success('Compra realizada con exito', purchase)
        }
        else return await this.error('No se ha creado el ticket', 500)
    }
}