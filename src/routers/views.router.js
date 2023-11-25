import { Router } from 'express'

import ProductManager from '../dao/managers/ProductManager.js'
import ProductsModel from '../dao/models/products.model.js'

const router = Router()
/* const productManager = new ProductManager()
const products = await productManager.getProducts() */


router.get('/', async (req, res) => {
    try{
        const productList = await ProductsModel.find().lean().exec()
        res.render('home', {productList})
    }
    catch(error){
        return res.status(500).json({error: error.message})
    }
})

router.get('/realTimeProducts', async (req, res) => {
    try{
        const productList = await ProductsModel.find().lean().exec()
        res.render('realTimeProducts', {productList})
    }
    catch(error){
        return res.status(500).json({error: error.message})
    }
})

//chat router

export default router