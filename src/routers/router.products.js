import { Router } from 'express'
import mongoose from 'mongoose'
import ProductsModel from '../dao/models/products.model.js'

const router = Router()

router.get('/', async (req, res) => {
    try{
        const products = await ProductsModel.find().lean().exec()
        let limitParsed = parseInt(req.query.limit)
        if (limitParsed){
            if(!isNaN(limitParsed) && limitParsed > 0){
                if(limitParsed > products.length) return res.status(404).json({error: `limit is above the number of products (${products.length})`})
                const sliceProducts = products.slice(0, limitParsed)

                return res.status(200).json({success: true, productos: sliceProducts})
            }else{
                if(isNaN(limitParsed)) return res.status(400).json({ success: false, error: 'limit has to be a number' })
                if(limitParsed <= 0) return res.status(400).json({success: false, error: 'limit has to be above 0'})
            }
        }
        return res.status(200).json({success: true, productos: products})
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.get('/:pid', async (req, res) => {
    try{
        const id = req.params.pid
        if(id <= 0) return res.status(400).json({success: false, error: 'ID has to be above 0'})

        const toObjectId = new mongoose.Types.ObjectId(id)
        const productById = await ProductsModel.findById(toObjectId).lean().exec()
        if (productById === null) return res.status(404).json({success: false, error: 'ID not found'})

        return res.status(200).json({success: true, producto: productById})
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.post('/', async (req, res) => {
    try{
        const productData = req.body
        const addProduct = await ProductsModel.create(productData)
        if(addProduct){
            return res.status(200).json({succes: true,  message: 'Se ha agregado correctamente el producto'})
        }else{
            return res.status(500).json({succes: false, error: 'No se ha agregado correctamente el producto'})
        }   
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.put('/:pid', async(req, res) => {
    try{
        const id = req.params.pid
        const toUpdate = req.body
        const toObjectId = new mongoose.Types.ObjectId(id)
        const prodDefault = await ProductsModel.findById(toObjectId).lean().exec()
        const prodModified = await ProductsModel.updateOne({ _id: id}, toUpdate)
        if(prodModified){
            const prodNew = await ProductsModel.findById(toObjectId).lean().exec()
            return res.status(200).json({success: true, message: 'Se ha modificado correctamente el producto', before: prodDefault, after: prodNew})
        }else{
            return res.status(500).json({success: false, message: 'No se ha modificado correctamente el producto'})
        }
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.delete('/:pid', async(req, res) => {
    try{
        const id = req.params.pid
        const toObjectId = new mongoose.Types.ObjectId(id)
        const deleteProduct = await ProductsModel.deleteOne({_id: toObjectId})
        if(deleteProduct){
            return res.status(200).json({success: true, message: 'Se ha eliminado correctamente el producto'})
        }else{
            return res.status(500).json({success: false, message: 'No se ha eliminado correctamente el producto'})
        }
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

export default router

