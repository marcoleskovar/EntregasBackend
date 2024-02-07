import mongoose from "mongoose"
import paginate from "mongoose-paginate-v2"

const productsCollection = 'products'
const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: [String],
        default: []
    },
    code: {
        type: String,
        required: true,
        unique: true,
        default: Math.random().toString(32).substring(7)
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    versionKey: false
})

productsSchema.plugin(paginate)

const ProductsModel = mongoose.model(productsCollection, productsSchema)

export default ProductsModel