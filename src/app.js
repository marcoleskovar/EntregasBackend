//IMPORT TOOLS
import express from 'express'
/* import mongoose from 'mongoose' */
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import initPassport from './config/passport.config.js'
import config from './config/config.js'
/* import dotenv from 'dotenv' */

//IMPORT ROUTERS
import productsRouter from './routers/router.products.js'
import cartRouter from './routers/router.cart.js'
/* import viewsRouter from './routers/router.views.js'
import chatRouter from './routers/router.chat.js'
import sessionRouter from './routers/router.session.js' */

//ENV
/* dotenv.config() */

//DEFINING CONSTANTS
const app = express()
/* const mongoURL = process.env.MONGO_URL
const mongoName = process.env.DB_NAME */

//CREATING SESSION
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongoURL,
        dbName: config.dbName,
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//INIT PASSPORT
initPassport()
app.use(passport.initialize())
app.use(passport.session())

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
app.use('/api/products', productsRouter) //CHECK
app.use('/api/carts', cartRouter)
/* app.use('/', viewsRouter)
app.use('/chat', chatRouter)
app.use('/session', sessionRouter) */

//LISTEN
app.listen(config.port, () => console.log('RUNNING...'))

/* mongoose.connect(mongoURL, {dbName: mongoName})
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
    }) */