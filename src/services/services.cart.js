import CartModel from "../dao/models/model.cart.js"

class CartService {
    constructor(){
        this.model = CartModel
    }

    async getAllCart () {//CHECK-DONE
        const cart = await this.model.find().lean()

        return {success: true, carrito: cart}
    }


    async getCartById (id) {//CHECK-DONE
        if (id <= 0) return {success: false, area: 'Service', tryError: 'ID has to be above 0', status: 400}
        
        const cartById = await this.model.findOne({_id: id}).lean()

        if (cartById === null) return {success: false, area: 'Service', tryError: 'CartID not found', status: 404}

        return {success: true, carrito: cartById}
    }


    async postCart (data) {//CHECK-DONE
        const addCart = await this.model.create(data)
        
        if (addCart) return {success: true,  message: 'Se ha creado correctamente el carrito', cartID: addCart._id}
        else return {success: false, area: 'Service', tryError: 'No se ha creado correctamente el carrito', status: 400}     
    }

    
    async addToCart (cid, productData) {//CHECK-DONE
        const cart = await this.getCartById(cid)

        if (!cart.success) return cart

        const product = productData

        if (!product.success) return product

        const result = await this.model.findOneAndUpdate(
            {_id: cart.carrito._id, "products.product": product.producto._id},
            {$inc: {"products.$.quantity": 1}},
            {new: true}
        ).lean()

        if(!result) {
            await this.model.findOneAndUpdate(
                { _id: cart.carrito._id },
                {
                    $push: {
                        products: {
                            product: product.producto._id,
                            quantity: 1,
                        }
                    }
                },
                { new: true }
            ).lean()
        }
        return {success: true,  message: 'Se ha agregado correctamente el producto al carrito', producto: product.producto}
    }


    async updateCart (cid, data) {//CHECK-DONE
        const cart = await this.getCartById(cid)

        if (!cart.success) return cart

        if(!Array.isArray(data)) return {success: false, area: 'Service', tryError: 'The product is not valid', status: 400}

        const cartModified = await this.model.findOneAndUpdate(
            { _id: cid },
            { $set: { products: data } },
            { new: true }
        ).lean()

        if(cartModified) return {success: false, area: 'Service', tryError: 'No se ha modificado correctamente el carrito', status: 400}
        return {success: true, message: 'Se ha modificado correctamente el carrito', before: cart, after: cartModified}
    }


    async updateCartQuant (cid, pid, data) {//CHECK-DONE
        const cart = await this.getCartById(cid)

        if (!cart.success) return cart

        const cartModified = await this.model.findOneAndUpdate(
            {_id: cid, "products.product": pid},
            {$set: {"products.$.quantity": data}},
            {new: true}
        ).lean()

        if(!cartModified) return {success: false, area: 'Service', tryError: 'No se ha modificado correctamente el carrito', status: 400}
        return {success: true, message: 'Se ha modificado correctamente el carrito', before: cart, after: cartModified}
    }


    async deleteCart (id) {//CHECK-DONE
        const cart = await this.getCartById(id)

        if (!cart.success) return cart

        const deleteCart = await this.model.deleteOne({_id: id})

        if(!deleteCart) return {success: false, area: 'Service', tryError: 'No se ha eliminado correctamente el carrito', status: 400}

        return {success: true, message: 'Se ha eliminado correctamente el carrito'}
    }


    async deleteProdCart (cid, pid) {//CHECK-DONE
        const cart = await this.getCartById(cid)

        if (!cart.success) return cart

        const productID = pid.producto._id

        const result = await this.model.findOneAndUpdate(
            { _id: cart.carrito._id },
            { $pull: { products: { product: productID } } },
            { new: true }
        ).lean()

        if(!result) return {success: false, area: 'Service', tryError: 'No se ha eliminado correctamente el producto del carrito', status: 400}

        return {success: true, message: 'Se ha eliminado correctamente el producto del carrito'}
    }
}

export default CartService