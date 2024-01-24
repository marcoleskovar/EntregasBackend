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
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }],
        default: []
    }
}, {
    versionKey: false
})

cartSchema.pre('findOne', function() {
    this.populate('products.product')
})

const CartModel = mongoose.model(cartCollection, cartSchema)

export default CartModel