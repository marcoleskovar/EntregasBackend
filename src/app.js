import express from 'express'
import ProductManager from "./ProductManager.js"

const app = express()
const productManager = new ProductManager()

app.get('/', (req, res) => res.send('Pagina Principal'))

app.get('/products', async (req, res) => {
    const fileContent = await productManager.getProducts()

    let limiteDeProductos = req.query.limit 

    if (limiteDeProductos){
        const limit = parseInt(limiteDeProductos)
        if(!isNaN(limit)){
            const productosLimitados = fileContent.slice(0, limit)
            return res.json({productos: productosLimitados})
        }
    }

    return res.json({data: fileContent})
})

app.get('/products/:pid', async (req, res) => {
    const requestedId = parseInt(req.params.pid)
    const productById = await productManager.getProductById(requestedId)
    
    return res.json ({producto: productById})
})

app.listen(8080, () => console.log('APP IS RUNNING'))