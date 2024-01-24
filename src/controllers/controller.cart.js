import { CartService } from "../services/service.js"
import { ProductService } from "../services/service.js"

const service = CartService

//IF ERROR - CONTROLLER
const controllerError = async (e) => {
    const result = {success: false, area: 'Cart-Controller', catchError: e.message, detail: e}
    return result
}

export const getCarts = async (req, res) => {//CHECK
    try {
        const result = await service.getCarts()

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}

export const getCartById = async (req, res) => {//CHECK
    try {
        const id = req.params.cid
        const result = await service.getCartById(id)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}

export const createCart = async (req, res) => {//CHECK
    try {
        const data = req.body
        const result = await service.createCart(data)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}

export const addToCart = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid

        const product = await ProductService.getProductById(pid)

        if (!product.success) return res.status(product.status).json(product)

        const result = await service.addToCart(cid, product)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}

export const updateCart = async (req, res) => {//body = [{"product": "pid"}]
    try {
        const id = req.params.cid
        const data = req.body

        for (const item of data) {
            const product = await ProductService.getProductById(item.product)
            
            if (!product.success) return res.status(product.status).json(product)
        } 

        const result = await service.updateCart(id, data)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}

export const updateCartQuant = async (req, res) => {//body = {quantity: number}
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const quantity = req.body.quantity

        const product = await ProductService.getProductById(pid)

        if (!product.success) return res.status(product.status).json(product)

        const result = await service.updateCartQuant(cid, pid, quantity)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}

export const deleteProdCart = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid

        const product = await ProductService.getProductById(pid)

        if (!product.success) return res.status(product.status).json(product)

        const result = await service.deleteProdCart(cid, pid)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}

export const deleteCart = async (req, res) => {//CHECK
    try {
        const id = req.params.cid
        const result = await service.deleteCart(id)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}