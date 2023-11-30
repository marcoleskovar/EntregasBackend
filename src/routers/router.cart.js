import { Router } from 'express'
import mongoose from 'mongoose'
import CartModel from '../dao/models/cart.model.js'
import ProductModel from '../dao/models/products.model.js'

const router = Router()

router.get('/', async (req, res) => {
    try{
        const cart = await CartModel.find().lean().exec()
        if(cart) return res.status(200).json({success: true, cart: cart})
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.get('/:cid', async (req, res) => {
    try{
        const id = req.params.cid
        if(id <= 0) return res.status(400).json({success: false, error: 'ID has to be above 0'})

        const productById = await CartModel.findOne({_id: id})
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

router.post('/:cid/products/:pid', async (req, res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        const cidToObjectId = new mongoose.Types.ObjectId(cid)
        const pidToObjectId = new mongoose.Types.ObjectId(pid)
       const foundInProducts = await ProductModel.findById(pidToObjectId)
        const foundInCart = await CartModel.findById(cidToObjectId)

        if (!foundInProducts) return res.status(404).json({success: false, error: 'ProductID not found'})
        if (!foundInCart) return res.status(404).json({success: false, error: 'CartID not found'})
        
        const producto = foundInCart.products.findIndex(p => p.product.equals(pidToObjectId))
        if(producto === -1){
            const newProduct = {
                product: pidToObjectId,
                quantity: 1,
            }
            foundInCart.products.push(newProduct)
        }else{
            foundInCart.products[producto].quantity++
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

router.put('/:cid', async(req, res) => {
    try{
        const id = req.params.cid
        const toUpdate = req.body.products
        const toObjectId = new mongoose.Types.ObjectId(id)
        const findInCart = await CartModel.findById(toObjectId)

        if(!findInCart) return res.status(404).json({success: false, message: 'CartID not found'})
        if (!Array.isArray(toUpdate)) return res.status(400).json({success: false, message: 'The product is not valid' })
        findInCart.products = toUpdate
        
        const result = await findInCart.save()

        if(result){
            const prodNew = await CartModel.findById(toObjectId).lean().exec()
            return res.status(200).json({success: true, message: 'Se ha modificado correctamente el producto', before: toObjectId, after: prodNew})
        }else{
            return res.status(500).json({success: false, message: 'No se ha modificado correctamente el producto'})
        }
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.put('/:cid/products/:pid', async(req, res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        const toUpdate = req.body.quantity
        const toObjectCid = new mongoose.Types.ObjectId(cid)
        const toObjectPid = new mongoose.Types.ObjectId(pid)
        const findInCart = await CartModel.findById(toObjectCid)

        if(!findInCart) return res.status(404).json({success: false, message: 'CartID not found'})

        const foundInProducts = findInCart.products.findIndex((item) => item.product.equals(toObjectPid))

        if (foundInProducts === -1) return res.status(400).json({success: false, message: 'The product is not valid' })

        if (!Number.isInteger(toUpdate) || toUpdate < 0) {
            return res.status(400).json({ status: error, message: 'Quantity must be a positive number' })
        }

        findInCart.products[foundInProducts].quantity = toUpdate

        const result = await findInCart.save()

        if(result){
            const prodNew = await CartModel.findById(toObjectCid).lean().exec()
            return res.status(200).json({success: true, message: 'Se ha modificado correctamente el producto', before: toObjectCid, after: prodNew})
        }else{
            return res.status(500).json({success: false, message: 'No se ha modificado correctamente el producto'})
        }
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.delete('/:cid', async (req, res) => {
    try{
        const cid = req.params.cid
        const cidToObjectId = new mongoose.Types.ObjectId(cid)
        const foundInCart = await CartModel.findByIdAndDelete(cidToObjectId)
        if(foundInCart){
            return res.status(200).json({succes: true,  message: 'Se ha eliminado correctamente el carrito'})
        }else{
            return res.status(404).json({success: false, error: 'CartID not found'})
        }
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.delete('/:cid/products/:pid', async (req, res) => {
    try{
        const cid = req.params.cid
        const pid = req.params.pid
        const cidToObjectId = new mongoose.Types.ObjectId(cid)
        const pidToObjectId = new mongoose.Types.ObjectId(pid)
        const foundInCart = await CartModel.findById(cidToObjectId)
        const foundInProducts = foundInCart.products.findIndex((item) => item.product.equals(pidToObjectId))
        if (!foundInCart) return res.status(404).json({success: false, error: 'CartID not found'})
        if (foundInProducts === -1) return res.status(404).json({success: false, error: 'ProductID not found'})

        foundInCart.products.splice(foundInProducts, 1)
        const result = await foundInCart.save()
        if(result){
            return res.status(200).json({succes: true,  message: 'Se ha eliminado correctamente el producto al carrito', payload: result})
        }else{
            return res.status(500).json({succes: false, error: 'No se ha eliminado correctamente el producto al carrito'})
        }
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

export default router