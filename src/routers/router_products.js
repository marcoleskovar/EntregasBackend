import { Router } from "express"
import ProductManager from '../managers/ProductManager.js'

const router = Router()
const productManager = new ProductManager()

router.get('/', async (req, res) => {
    try{
        const fileContent = await productManager.getProducts()
        let limiteDeProductos = req.query.limit 
        if (limiteDeProductos){
            const limit = parseInt(limiteDeProductos)
            if(!isNaN(limit) && limit > 0){
                if(limit > fileContent.length)return res.status(404).json({error: `limit is above the number of products (${fileContent.length})`})
    
                const productosLimitados = fileContent.slice(0, limit)
    
                return res.status(200).json({productos: productosLimitados})
            }else{
                if(isNaN(limit) )return res.status(400).json({ error: 'limit has to be a number' })
                if(limit <= 0) return res.status(400).json({error: 'limit has to be above 0'})
            }
        }
    
        return res.status(200).json({data: fileContent})
    }
    catch(error){
        return res.status(500).json({error: error.message})
    }
})

router.get('/:pid', async (req, res) => {
    try{
        const fileContent = await productManager.getProducts()
        const requestedId = parseInt(req.params.pid)
        if (!isNaN(requestedId) && requestedId > 0){
            if(requestedId > fileContent.length) return res.status(404).json({error: 'ID not found'})
            const productById = await productManager.getProductById(requestedId)
        
            return res.json ({producto: productById})
        }else{
            if(requestedId <= 0) return res.status(400).json({error: 'ID has to be above 0'})
            if(isNaN(requestedId) )return res.status(400).json({ error: 'ID has to be a number' })
        }
    }
    catch(error){
        return res.status(500).json({error: error.message})
    }
})

router.post('/', async (req, res) => {
    try{
        const result = await productManager.addProduct(productData)

        if(result && result.success){
            return res.status(200).json({success: result.message})
        }else{
            return res.status(result.status).json({error: result.message})
        }
    }
    catch(error){
        return res.status(500).json({error: error.message})
    }
})

router.put('/:pid', async(req, res) => {
    try{
        const id = parseInt(req.params.pid)
        const toUpdate = req.body
        const result = await productManager.updateProduct(id, toUpdate)
        if(result && result.success){
            return res.status(200).json({success: result.message})
        }else{
            return res.status(result.status).json({error: result.message})
        }
    }
    catch(error){
        return res.status(500).json({error: error.message})
    }
})

router.delete('/:pid', async(req, res) => {
    try{
        const id = parseInt(req.params.pid)
        const result = await productManager.deleteProduct(id)
        if(result && result.success){
            return res.status(200).json({success: result.message})
        }else{
            return res.status(result.status).json({error: result.message})
        }
    }
    catch(error){
        return res.status(500).json({error: error.message})
    }
})

export default router