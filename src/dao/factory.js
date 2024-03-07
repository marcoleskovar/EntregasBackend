import config from "../config/config.js"
import mongoose from "mongoose"
import { opts } from "../config/commander.js"
import { logger } from "../utils/logger.js"

export let Product
export let Cart
export let User
export let Chat

logger.info(`Persistence: ${opts.persistence}`)

switch (opts.persistence) {
    case 'MONGO':
        let mongoDBName;
        if (opts.env === 'DEV') mongoDBName = 'test-ecommerce'
        else mongoDBName = config.dbName
        await mongoose.connect(config.mongoURL, {dbName: mongoDBName})
            .then(() => {logger.info('Mongo connected')})
            .catch((err) => {return logger.fatal({message: 'Error connecting to Mongo', status: 500, area: 'factory', detail: err})})
        
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