import { Router } from 'express'
import mongoose from 'mongoose'
import CartModel from '../dao/models/cart.model.js'
import ProductModel from '../dao/models/products.model.js'

const router = Router()

router.get('/:cid', async (req, res) => {
    try{
        const id = req.params.cid
        if(id <= 0) return res.status(400).json({success: false, error: 'ID has to be above 0'})

        const toObjectId = new mongoose.Types.ObjectId(id)
        const productById = await CartModel.findById(toObjectId).lean().exec()
        if (productById === null) return res.status(404).json({success: false, error: 'ID not found'})

        return res.status(200).json({success: true, producto: productById})
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.post('/', async (req, res) => {
    try{
        const cartData = req.body
        const addCart = await CartModel.create(cartData)
        if(addCart){
            return res.status(200).json({succes: true,  message: 'Se ha agregado correctamente el carrito'})
        }else{
            return res.status(500).json({succes: false, error: 'No se ha agregado correctamente el carrito'})
        }   
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        const cidToObjectId = new mongoose.Types.ObjectId(cid)
        const pidToObjectId = new mongoose.Types.ObjectId(pid)
        const foundInProducts = await ProductModel.findById(pidToObjectId)
        const foundInCart = await CartModel.findById(cidToObjectId)
        if (!foundInProducts) return res.status(404).json({success: false, error: 'ProductID not found'})
        if (!foundInCart) return res.status(404).json({success: false, error: 'CartID not found'})
        
        const producto = foundInCart.products.find(p => p.product.toString() === pid)
        if(!producto){
            const newProduct = {
                product: pid,
                quantity: 1,
            }
            foundInCart.products.push(newProduct)
        }else{
            producto.quantity++
        }
        const result = await foundInCart.save()
        if(result){
            return res.status(200).json({succes: true,  message: 'Se ha agregado correctamente el producto al carrito'})
        }else{
            return res.status(500).json({succes: false, error: 'No se ha agregado correctamente el producto al carrito'})
        }
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

export default router