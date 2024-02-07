//IMPORT TOOLS
import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import initPassport from './config/passport.config.js'
import config from './config/config.js'

//IMPORT ROUTERS
import productsRouter from './routers/product.router.js'
import cartRouter from './routers/cart.router.js'
import sessionRouter from './routers/session.router.js'
import viewsRouter from './routers/router.views.js'
import chatRouter from './routers/chat.router.js'

//DEFINING CONSTANTS
const app = express()

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
handlebars.allowProtoMethodsByDefault = true

//USE JSON
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//STATIC
app.use('/static', express.static(__dirname + '/public'))

//ROUTERS
app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/session', sessionRouter) 
app.use('/chat', chatRouter)

//LISTEN
const httpServer = app.listen(config.port, () => console.log('RUNNING...'))
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