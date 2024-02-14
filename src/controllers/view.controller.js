import { ProductService, CartService } from "../services/service.js"
import { generateMockingProds } from "../utils.js"
import ViewsManager from "../dao/file/managers/ViewsManager.js"
import { logger } from "../utils/logger.js"
import { error } from "../utils.js"

const manager = new ViewsManager()
const area = 'viewController'

export const homeView = async (req, res) => {
    try {
        const result = await ProductService.queryParams(req)
        const home = await manager.homeView(result)
        if (home.success) return res.json(home)
    }
    catch (e) {
        const err = await error ('Error in homeView', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}

export const productsView = async (req, res) => {
    try {
        const user = req.session.user
        const result = await ProductService.queryParams(req)
        res.render('products', {result, user})
    }
    catch (e) {
        const err = await error ('Error in productsView', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}

export const realTimeProductsView = async (req, res) => {
    try {
        const result = await ProductService.queryParams(req)
        res.render('realTimeProducts', result)
    }
    catch (e) {
        const err = await error ('Error in realTimeProductsView', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}

export const cartView = async (req, res) => {
    try {
        const cid = req.session.user.cart
        const result = await CartService.getCartById(cid)
        if (!result.success) return res.status(result.status).json(result)
        else {
            const products = result.result.products
            return res.render('cart', {products, cid})
        }
    }
    catch (e) {
        const err = await error ('Error in cartView', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}


export const profileView = async (req, res) => {
    try {
        const user = req.session.user
        res.render('profile', user)
    }
    catch (e) {
        const err = await error ('Error in profileView', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}

export const mockingProds = async (req, res) => {
    const products = []
    for (let i = 0; i <= 100; i++){
        products.push(generateMockingProds())
    }
    return res.send(products)
}

export const logoutView = async (req, res) => {
    req.session.destroy(err => {
        if(err) return res.send('Logout error')
        return res.redirect('/session/login')
    })   
}

export const testLogs = async (req, res) => {
    logger.debug('PASS')
    logger.http('PASS')
    logger.info('PASS')
    logger.warning('PASS')
    logger.error(await error('PASS', 200, 'viewsController', 'TEST-RESULT'))
    logger.fatal(await error('PASS', 200, 'viewsController', 'TEST-RESULT'))
    return res.json({result: 'tested'})
}