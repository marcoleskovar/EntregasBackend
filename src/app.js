import express from 'express'
import productsRouter from './routers/router_products.js'
import cartRouter from './routers/router_cart.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('./public'))

app.get('/', (req, res) => res.send('Pagina Principal'))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartRouter)

app.listen(8080, () => console.log('APP IS RUNNING'))