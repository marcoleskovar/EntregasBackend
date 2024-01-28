import { ProductService } from "../services/service.js"
import ViewsManager from "../dao/file/managers/ViewsManager.js"

const manager = new ViewsManager()

export const auth = (req, res, next) => {
    if (req.session?.user) return next()
    res.redirect('/session/login')
}

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

export const logoutView = async (req, res) => {
    req.session.destroy(err => {
        if(err) return res.send('Logout error')
        return res.redirect('/session/login')
    })   
}