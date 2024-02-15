import { CartService, ProductService } from "../services/service.js"
import { error } from "../utils.js"
import { logger } from "../utils/logger.js"

const service = CartService
const area = 'cartController'

export const getCarts = async (req, res) => {//CHECK
    try {
        const result = await service.getCarts()

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (e) {
        const err = await error ('Error in getCarts', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}

export const getCartById = async (req, res) => {//CHECK
    try {
        const id = req.params.cid
        const result = await service.getCartById(id)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (e) {
        const err = await error ('Error in getCartById', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}

export const createCart = async (req, res) => {//CHECK
    try {
        const data = req.body
        const result = await service.createCart(data)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (e) {
        const err = await error ('Error in createCart', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}

export const addToCart = async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.params.pid

        const product = await ProductService.getProductById(pid)

        if (!product.success) return res.status(product.status).json(product)

        const result = await service.addToCart(cid, product.result)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (e) {
        const err = await error ('Error in addToCart', 500, area, e)
        logger.error (err)
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
    } catch (e) {
        const err = await error (e.message, 500, area, e)
        logger.error (err)
        if (err.message === 'data is not iterable'){
            const nonIterableData = await error('Body debe recibir por lo menos << [{``product``: productID}] >>', 400, area, e)
            logger.error (nonIterableData)
            return res.status(400).json(nonIterableData)
        }
        return res.status(500).json(err)
    }
}

export const updateCartQuant = async (req, res) => {//body = {quantity: number}
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const quantity = req.body.quantity

        if (!quantity) {
            logger.warning('Body debe recibir ``{quantity``: Number}', 400, area)
            throw new Error ('Body debe recibir ``{quantity``: Number}')
        }

        const product = await ProductService.getProductById(pid)

        if (!product.success) return res.status(product.status).json(product)

        const result = await service.updateCartQuant(cid, pid, quantity)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (e) {
        const err = await error ('Error in updateCartQuant', 500, area, e)
        logger.error (err)
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
    } catch (e) {
        const err = await error ('Error in deleteProdCart', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}

export const deleteCart = async (req, res) => {//CHECK
    try {
        const id = req.params.cid
        const result = await service.deleteCart(id)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (e) {
        const err = await error ('Error in deleteCart', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}

export const purchaseCart = async (req, res) => {
    try {
        const cid = req.params.cid
        if (cid == req.session.user.cart) {
            const result = await service.purchaseCart(cid, req.session.user.email)
            if (!result.success){
                if (result.tryError === 'Not Valid Products') res.redirect(`/api/carts/${cid}`)
                else return res.status(result.status).send(result)
            }
            else {
                return res.json({status: 'success'})//no funciona!
            }
        }
    } catch (e) {
        const err = await error ('Error in purchaseCart', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}