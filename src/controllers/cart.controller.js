import { CartService, ProductService } from "../services/service.js"

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

export const cartView = async (req, res) => {
    try {
        const cid = req.session.user.cart
        const result = await service.getCartById(cid)
        if (!result.success) return res.status(result.status).json(result)
        else {
            const products = result.result.products
            return res.render('cart', {products, cid})
        }
    }
    catch (error) {
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

        const result = await service.addToCart(cid, product.result)

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
        if (err.catchError === 'data is not iterable'){
            const nonIterableData = await controllerError('Body debe recibir por lo menos << [{``product``: productID}] >>')
            return res.status(500).json(nonIterableData)
        }
        return res.status(500).json(err)
    }
}

export const updateCartQuant = async (req, res) => {//body = {quantity: number}
    try {
        const cid = req.params.cid
        const pid = req.params.pid
        const quantity = req.body.quantity

        if (!quantity) throw new Error ('Body debe recibir ``{quantity``: Number}')

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

export const purchaseCart = async (req, res) => {
    try {
        const cid = req.params.cid
        const validProds = []
        const rejectedProds = []
        const cart = await service.getCartById(cid)
        if (cid === req.session.user.cart) {
            const valid = await service.validToPurchase(cid)
            valid.map(async d => {
                if (d.success) {
                    validProds.push(d.result)
                }
                else {
                    rejectedProds.push(d.tryError)}
            })
            if (validProds.length === 0) return res.redirect(`/api/carts/${cart}`)//NO FUNCIONA
            const result = await service.purchaseCart(cid, validProds, req.session.user.email)
            if (!result.success) return res.status(result.status).send(result)
            else {
                if (rejectedProds.length !== 0) return res.json(cart)
                else return res.redirect('/api/products')//NO FUNCIONA
            }
        }
    } catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}