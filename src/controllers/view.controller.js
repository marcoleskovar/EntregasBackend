import { ProductService, CartService } from "../services/service.js"
import { generateMockingProds } from "../utils.js"
import ViewsManager from "../dao/file/managers/ViewsManager.js"

const manager = new ViewsManager()

const controllerError = async (e) => {
    const result = {success: false, area: 'Views-Controller', catchError: e.message, detail: e}
    return result
}


export const homeView = async (req, res) => {
    try {
        const result = await ProductService.queryParams(req)
        const home = await manager.homeView(result)
        if (home.success) return res.json(home)
    }
    catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}

export const productsView = async (req, res) => {
    try {
        const user = req.session.user
        const result = await ProductService.queryParams(req)
        res.render('products', {result, user})
    }
    catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}

export const realTimeProductsView = async (req, res) => {
    try {
        const result = await ProductService.queryParams(req)
        res.render('realTimeProducts', result)
    }
    catch (error) {
        const err = await controllerError(error)
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
    catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}


export const profileView = async (req, res) => {
    try {
        const user = req.session.user
        res.render('profile', user)
    }
    catch (error) {
        const err = await controllerError(error)
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