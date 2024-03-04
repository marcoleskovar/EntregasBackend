//IMPORT LIBRARIES
import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import passport from 'passport'
import swaggerJSDoc from 'swagger-jsdoc'
import SwaggerUiExpress from 'swagger-ui-express'

//IMPORT TOOLS
import __dirname from './utils.js'
import initPassport from './config/passport.config.js'
import config from './config/config.js'
import {logger, addLogger} from './utils/logger.js'
import { opts } from './config/commander.js'

//IMPORT ROUTERS
import productsRouter from './routers/product.router.js'
import cartRouter from './routers/cart.router.js'
import userRouter from './routers/user.router.js'
import sessionRouter from './routers/session.router.js'
import viewsRouter from './routers/router.views.js'
import chatRouter from './routers/chat.router.js'

//DEFINING CONSTANTS
const app = express()

//LOGGER
app.use(addLogger)

//CREATING SESSION
app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongoURL,
        dbName: config.dbName,
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
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

//SWAGGER
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion de aplicacion backend Marco Leskovar',
            description: 'Este es un proyecto que te permite la visualizacion, creacion, actualizacion y eliminacion de productos asi como todo lo que refiere a tener un carrito dinamico, un sistema de sesiones con login y registro y mucho mas!'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}
const specs = swaggerJSDoc(swaggerOptions)

//ROUTERS
app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)
app.use('/api/users', userRouter)
app.use('/session', sessionRouter) 
app.use('/chat', chatRouter)

if (opts.env === 'DEV') {
    app.use('/api/docs', SwaggerUiExpress.serve, SwaggerUiExpress.setup(specs))
}

//LISTEN
const httpServer = app.listen(config.port, () => logger.info('Running'))
const io = new Server(httpServer)
io.on('connection', socket => {
    logger.info('New client connected')
    
    socket.on('newList', async products => {
        io.emit('updatedProducts', products)
    })
    socket.on('message', async data => {
        socket.emit('chat', data)
    })
})