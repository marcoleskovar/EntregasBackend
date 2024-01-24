import config from "../config/config.js"
import mongoose from "mongoose"

export let Product
export let Cart
export let User

console.log('PERSISTENCIA:', config.persistence)

switch (config.persistence) {
    case 'MONGO':
        await mongoose.connect(config.mongoURL, {dbName: config.dbName})
        console.log('DB CONNECTED')
        
        const {default: ProductMongo} = await import ('./mongo/product.mongo.js')
        const {default: CartMongo} = await import ('./mongo/cart.mongo.js')
        const {default: UserMongo} = await import ('./mongo/user.mongo.js')

        Product = ProductMongo
        Cart = CartMongo
        User = UserMongo

        break
    case 'FILE':
    
        break
    case 'MEMORY':

        break

    default:
        throw new Error ('PERSISTENCIA NO IDENTIFICADA')
}