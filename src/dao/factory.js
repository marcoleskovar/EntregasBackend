import config from "../config/config.js"
import mongoose from "mongoose"
import { opts } from "../config/commander.js"
import { logger } from "../utils/logger.js"

export let Product
export let Cart
export let User
export let Chat

const errorFunc = (message= '', status, area, detail = '') => {
    return {message, status, area, detail}
}

logger.info(`Persistence: ${opts.persistence}`)

switch (opts.persistence) {
    case 'MONGO':
        await mongoose.connect(config.mongoURL, {dbName: config.dbName})
            .then(() => {logger.info('Mongo connected')})
            .catch((err) => {return logger.fatal(errorFunc('Error connecting to Mongo', 500, 'factory', err))})
        
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
        const {default: ChatFile} = await import ('./file/managers/ChatManager.js')

        Product = ProductFile
        Cart = CartFile
        User = UserFile
        Chat = ChatFile
        
        break
    default:
        logger.fatal('Undefined persistence')
        process.exit(1)
}