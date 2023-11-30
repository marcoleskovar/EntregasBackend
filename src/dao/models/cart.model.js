import mongoose from "mongoose"

const cartCollection = 'carts'
const cartSchema = new mongoose.Schema({
    products: {
        type: [{
            _id: false,
            product: {
                type: mongoose.ObjectId,
                ref: 'products'
            },
            quantity: Number,
        }],
        default: []
    }
})

cartSchema.pre('findOne', function() {
    this.populate('products.product')
})

const CartModel = mongoose.model(cartCollection, cartSchema)

export default CartModel