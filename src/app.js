import express from 'express'
import productsRouter from './routers/router_products.js'
import cartRouter from './routers/router_cart.js'
import viewsRouter from './routers/views.router.js'

import handlebars from 'express-handlebars'
import { Server, Socket } from 'socket.io'
import __dirname from './utils.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/static', express.static(__dirname + '/public'))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.use('/', viewsRouter)
app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)

const httpServer = app.listen(8080, () => console.log('APP IS RUNNING'))
const socketServer = new Server(httpServer)


socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado')
    
    socket.on('newProduct', product => {
        socketServer.emit('nuevaLista', product)
    })
})