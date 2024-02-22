import { ProductService } from "../services/service.js"
import ProductDTO from "../dto/file/product.dto.js"
import { error } from "../utils.js"
import { logger } from "../utils/logger.js"

const service = ProductService
const area = 'productController'

export const getProducts = async (req, res) => {//CHECK
    try {
        const limit = req.query.limit
        const result = await service.getProducts(limit)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (e) {
        const err = await error ('Error in getProducts', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}

export const getProductById = async (req, res) => {//CHECK
    try {
        const id = req.params.pid
        const result = await service.getProductById(id)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (e) {
        const err = await error ('Error in getProductById', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}

export const createProduct = async (req, res) => {//CHECK
    try {
        const data = req.body
        const user = req.session.user
        const dto = new ProductDTO(data)

        const result = await service.createProduct(dto, user)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (e) {
        const err = await error ('Error in createProduct', 500, area, e)
        logger.error (err)
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
    } catch (e) {
        const err = await error ('Error in updateProduct', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}

export const deleteProduct = async (req, res) => {//CHECK
    try {
        const id = req.params.pid
        const user = req.session.user
        const result = await service.deleteProduct(id, user)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (e) {
        const err = await error ('Error in deleteProduct', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}