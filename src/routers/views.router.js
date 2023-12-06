import { Router } from 'express'
import ProductsModel from '../dao/models/products.model.js'

const router = Router()


const queryParams = async (req) => {
    const limit = parseInt(req.query?.limit ?? 10)
    const page = parseInt(req.query?.page ?? 1)
    const sort = req.query?.sort ?? ''
    const sortOptions = sort === 'asc' ? { price: 1 } : (sort === 'des' ? { price: -1 } : {})

    const result = await ProductsModel.paginate({}, {
            page,
            limit,
            sort: sortOptions,
            lean: true
    })
    result.sort = sort

    return result
}


router.get('/', async (req, res) => {
    try{
        const result = await queryParams(req)
        const prevPage = result.prevPage
        const nextPage = result.nextPage
        const hasPrevPage = result.hasPrevPage
        const hasNextPage = result.hasNextPage
        res.render('home', {})
        return res.status(200).json({
            status: 'success', 
            payload: result.docs, 
            totalPages: result.totalPages,
            prevPage,
            nextPage,
            page: result.page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `/?page=${prevPage}` : null,
            nextLink: hasNextPage ? `/?page=${nextPage}` : null
        })
    }
    catch(e){
        console.log(e);
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.get('/products', async (req, res) => {
    try{
        const result = await queryParams(req)
        res.render('products', result)
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.get('/realTimeProducts', async (req, res) => {
    try{
        const result = await queryParams(req)
        res.render('realTimeProducts', result)
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

export default router