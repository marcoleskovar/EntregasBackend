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
        else return await this.success('El carrito se encontro correctamente', cartById)
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

        if (!cart.success) return cart

        const updateQuery = {
            query: {_id: cid, "products.product": productData.result._id},
            update: {$inc: {"products.$.quantity": 1}},
            options: {new: true}
        }
        const result = await this.dao.updateCart(updateQuery)

        if(!result) {
            const cartUpdateQuery = {
                query: { _id: cart.result._id },
                update: {
                    $push: {
                        products: {
                            product: productData.result._id,
                            quantity: 1,
                        },
                    },
                },
                options: { new: true }
            }
                await this.dao.updateCart(cartUpdateQuery)
        }

        return await this.success('Se ha agregado correctamente el producto al carrito', productData.result)
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
            query: { _id: cart.result._id },
            update: {
                $set: {
                    products: toUpdate,
                },
            },
            options: { new: true, upsert: true },
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
            options: {new: true}
        }

        const cartModified = await this.dao.updateCart(cartUpdateQuery)

        if(!cartModified) return await this.error('No se ha modificado correctamente el carrito', 400)
        else return await this.success('Se ha modificado correctamente el carrito', cartModified)
    }

    //DELETE PRODUCT FROM CART
    async deleteProdCart (cid, pid) {
        const cart = await this.getCartById(cid)

        if (!cart.success) return cart

        const cartUpdateQuery = {
            query: {_id: cid},
            update: {$pull: {products: {product: pid}}},
            options: {new: true}
        }

        const cartModified = await this.dao.updateCart(cartUpdateQuery)
        
        if(!cartModified) return await this.error('No se ha eliminado correctamente el producto del carrito', 400)
        else return await this.success('Se ha eliminado correctamente el producto del carrito', cartModified)
    }
    
    //DELETE CART
    async deleteCart (id) {
        const exist = await this.getCartById(id)

        if (!exist.success) return exist

        const cart = await this.dao.deleteCart(id)

        if (cart.deletedCount > 0) return await this.success('Se ha eliminado correctamente el carrito', exist.result)
        else return await this.error('No se ha eliminado correctamente el carrito', 400)
    }
}