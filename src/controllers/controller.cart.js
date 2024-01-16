import CartService from "../services/services.cart.js"
import ProductsService from "../services/services.products.js"

const productService = new ProductsService()
const service = new CartService()

export const getAllCart = async (req, res) => {//CHECK-DONE
    try {
        const result = await service.getAllCart()

        if(result.success) return res.status(200).json(result)
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}

export const getCartById = async (req, res) => {//CHECK-DONE
    try {
        const id = req.params.cid
        const result = await service.getCartById(id)

        if(!result.success) return res.status(result.status).json(result)

        return res.status(200).json(result)
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}

export const postCart = async (req, res) => {//CHECK-DONE
    try {
        const cartData = req.body
        const result = await service.postCart(cartData)

        if(!result.success) return res.status(result.status).json(result)

        return res.status(200).json(result)
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}

export const addToCart = async (req, res) => {//CHECK-DONE
    try {
        const cartID = req.params.cid
        const productID = req.params.pid

        const product = await productService.getProductById(productID)

        if(!product.success) return res.status(product.status).json(product)

        const result = await service.addToCart(cartID, product)
        
        if(!result.success) return res.status(result.status).json(result)

        return res.status(200).json(result)
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}

export const updateCart = async (req, res) => {//CHECK-DONE
    try {
        const cid = req.params.cid
        const data = req.body
        const result = await service.updateCart(cid, data)

        if(!result.success) return res.status(result.status).json(result)

        return res.status(200).json(result)
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}

export const updateCartQuant = async (req, res) => {//CHECK-DONE
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const quantity = req.body.quantity
        const result = await service.updateCartQuant(cid, pid, quantity)
        
        if(!result.success) return res.status(result.status).json(result)

        return res.status(200).json(result)
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}

export const deleteCart = async (req, res) => {//CHECK-DONE
    try {
        const cid = req.params.cid
        const result = await service.deleteCart(cid)

        if(!result.success) return res.status(result.status).json(result)
        
        return res.status(200).json(result)
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}

export const deleteProdCart = async (req, res) => {//CHECK-DONE
    try {
        const cid = req.params.cid
        const pid = req.params.pid

        const product = await productService.getProductById(pid)

        if(!product.success) return res.status(product.status).json(product)

        const result = await service.deleteProdCart(cid, product)
        
        if(!result.success) return res.status(result.status).json(result)

        return res.status(200).json(result)
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}