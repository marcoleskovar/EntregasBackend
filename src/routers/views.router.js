import { Router } from 'express'
import ProductManager from '../managers/ProductManager.js'
import { Server } from 'socket.io'

const router = Router()
const productManager = new ProductManager()
const products = await productManager.getProducts()
const socketServer = new Server()

socketServer.on('nuevaLista', async product => {
    await productManager.addProduct(product) 
    const updateProducts= await productManager.getProducts()
    socketServer.emit('nuevaLista', updateProducts)
})

router.get('/', async (req, res) => {
    try{
        res.render('home', {
            products: products,
        })
    }
    catch(error){
        return res.status(500).json({error: error.message})
    }
})

router.get('/realTimeProducts', async (req, res) => {
    try{
        const updateProducts= await productManager.getProducts()
        res.render('realTimeProducts', {
            products: updateProducts
        })
    }
    catch(error){
        return res.status(500).json({error: error.message})
    }
})

export default router