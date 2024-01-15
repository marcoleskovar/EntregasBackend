import ProductsService from "../services/services.products.js"

const service = new ProductsService()

export const getAllProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
        const result = await service.getAllProducts(limit)

        if(!result.success) return res.status(result.status).json(result)

        return res.status(200).json(result)
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}

export const getById = async (req, res) => {
    try {
        const id = req.params.pid
        const result = await service.getById(id)

        if(!result.success) return res.status(result.status).json(result)

        return res.status(200).json(result)
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}

export const postProduct = async (req, res) => {
    try {
        const productData = req.body
        const result = await service.postProduct(productData)

        if(!result.success) return res.status(result.status).json(result)

        return res.status(200).json(result)
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}

export const updateProduct = async (req, res) => {
    try {
        const id = req.params.pid
        const toUpdate = req.body
        const result = await service.updateProduct (id, toUpdate)

        if(!result.success) return res.status(result.status).json(result)

        return res.status(200).json(result)
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}

export const deleteProduct = async (req, res) => {
    try{
        const id = req.params.pid
        const result = await service.deleteProduct(id)

        if(!result.success) return res.status(result.status).json(result)

        return res.status(200).json(result)
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}