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

const auth = (req, res, next) => {
    if(req.session?.user) return next()
    res.redirect('/session/login')
}


router.get('/', auth, async (req, res) => {
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

router.get('/products', auth, async (req, res) => {
    try{
        const user = req.session.user
        const result = await queryParams(req)
        res.render('products', {result, user})
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.get('/realTimeProducts', auth, async (req, res) => {
    try{
        const result = await queryParams(req)
        res.render('realTimeProducts', result)
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.get('/profile', auth, async (req, res) => {
    const user = req.session.user
    res.render('profile', user)
})

router.get('/logout', auth, (req, res) => {
    req.session.destroy(err => {
        if(err) return res.send('Logout error')
        return res.redirect('/login')
    })
})

export default router