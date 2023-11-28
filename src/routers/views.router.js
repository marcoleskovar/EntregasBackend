import { Router } from 'express'
import ProductsModel from '../dao/models/products.model.js'

const router = Router()


router.get('/', async (req, res) => {
    try{
        const productList = await ProductsModel.find().lean().exec()
        res.render('home', {productList})
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.get('/realTimeProducts', async (req, res) => {
    try{
        const productList = await ProductsModel.find().lean().exec()
        res.render('realTimeProducts', {productList})
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

export default router