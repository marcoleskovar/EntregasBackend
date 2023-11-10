import { Router } from 'express'
import ProductManager from '../managers/ProductManager.js'

const router = Router()
const productManager = new ProductManager()
const products = await productManager.getProducts()


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
        const list = await productManager.getProducts()
        res.render('realTimeProducts', {list})
    }
    catch(error){
        return res.status(500).json({error: error.message})
    }
})

export default router