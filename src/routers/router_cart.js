import { Router } from 'express'
import CartManager from '../managers/CartManager.js'

const router = Router()
const cartManager = new CartManager()

router.get('/:cid', async (req, res) => {
    const id = parseInt(req.params.cid)
    const carrito = await cartManager.getProductById(id)
    res.send(carrito.products)
})

router.post('/', async (req, res) => {
    try{
        const result = await cartManager.createCart()

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

router.post('/:cid/product/:pid', async (req, res) => {
    try{
        const cartId = parseInt(req.params.cid)
        const productId = parseInt(req.params.pid)
        const result = await cartManager.addToCart(cartId, productId)

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