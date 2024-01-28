import { ProductService } from "../services/service.js"
import ProductDTO from "../dto/file/product.dto.js"

const service = ProductService

const controllerError = async (e) => {
    const result = {success: false, area: 'Product-Controller', catchError: e.message, detail: e}
    return result
}

export const getProducts = async (req, res) => {//CHECK
    try {
        const limit = req.query.limit
        const result = await service.getProducts(limit)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}

export const getProductById = async (req, res) => {//CHECK
    try {
        const id = req.params.pid
        const result = await service.getProductById(id)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}

export const createProduct = async (req, res) => {//CHECK
    try {
        const data = req.body
        const dto = new ProductDTO(data)

        const result = await service.createProduct(dto)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}

export const updateProduct = async (req, res) => {//CHECK
    try {
        const id = req.params.pid
        const data = req.body
        const result = await service.updateProduct(id, data)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}

export const deleteProduct = async (req, res) => {//CHECK
    try {
        const id = req.params.pid
        const result = await service.deleteProduct(id)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}