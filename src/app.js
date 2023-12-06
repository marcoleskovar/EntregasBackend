//IMPORT TOOLS
import express from 'express'
import mongoose from 'mongoose'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import session from 'express-session'
import MongoStore from 'connect-mongo'

//IMPORT ROUTERS
import viewsRouter from './routers/views.router.js'
import chatRouter from './routers/chat.router.js'
import productsRouter from './routers/router.products.js'
import cartRouter from './routers/router.cart.js'
import sessionRouter from './routers/session.router.js'

//DEFINING CONSTANTS
const app = express()
const mongoURL = 'mongodb+srv://marcoMONGO:boxitraci0MONGO@ecommerce.djq8g7q.mongodb.net/'
const mongoName = 'ecommerce'

//CREATING SESSION
app.use(session({
    store: MongoStore.create({
        mongoUrl: mongoURL,
        dbName: mongoName
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//CONFIG ENGINE
app.engine('hbs', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'hbs')

//USE JSON
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//STATIC
app.use('/static', express.static(__dirname + '/public'))

//ROUTERS
app.use('/', viewsRouter)
app.use('/chat', chatRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/session', sessionRouter)

//LISTEN
mongoose.connect(mongoURL, {dbName: mongoName})
    .then(() => {
        //TO CHECK socket
        console.log('DB CONNECTED')
    })
    .catch(e => console.log(e))
    .finally(() => {
        const PORT = process.env.PORT || 8080
        const httpServer = app.listen(PORT, () => console.log('RUNNING...'))
        const io = new Server(httpServer)
        io.on('connection', socket => {
            console.log('Nuevo cliente conectado')
            
            socket.on('newList', async products => {
                io.emit('updatedProducts', products)
            })
            socket.on('message', async data => {
                socket.emit('chat', data)
            })
        })
    })