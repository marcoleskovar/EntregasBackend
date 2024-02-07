import config from "../config/config.js"
import mongoose from "mongoose"
import { opts } from "../config/commander.js"

export let Product
export let Cart
export let User
export let Chat

console.log('PERSISTENCIA:', opts.persistence)

switch (opts.persistence) {
    case 'MONGO':
        await mongoose.connect(config.mongoURL, {dbName: config.dbName})
        console.log('DB CONNECTED')
        
        const {default: ProductMongo} = await import ('./mongo/product.mongo.js')
        const {default: CartMongo} = await import ('./mongo/cart.mongo.js')
        const {default: UserMongo} = await import ('./mongo/user.mongo.js')
        const {default: ChatMongo} = await import ('./mongo/chat.mongo.js')

        Product = ProductMongo
        Cart = CartMongo
        User = UserMongo
        Chat = ChatMongo

        break
    case 'FILE':
        const {default: ProductFile} = await import ('./file/managers/ProductManager.js')
        const {default: CartFile} = await import ('./file/managers/CartManager.js')
        const {default: UserFile} = await import ('./file/managers/UserManager.js')

        Product = ProductFile
        Cart = CartFile
        User = UserFile
        
        break
    case 'MEMORY':

        break

    default:
        throw new Error ('PERSISTENCIA NO IDENTIFICADA')
}