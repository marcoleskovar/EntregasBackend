import ViewsServices from "../services/session.repository.js"
import { ProductService } from "../services/service.js"

const view = new ViewsServices()

export const auth = (req, res, next) => {
    if (req.session?.user) return next()
    res.redirect('/session/login')
}


export const homeView = async (req, res) => {
    try {
        const paginate = await view.queryParams(req)
        const home = await view.homeView(paginate)
        if (home.success) return res.render('home', {})
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}

export const productsView = async (req, res) => {
    try {
        const user = req.session.user
        const result = await ProductService.queryParams(req)
        console.log('Pagination Options:', req.query)
        console.log('Result Docs:', result.docs);
        res.render('products', {result, user})
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}

export const realTimeProductsView = async (req, res) => {
    try {
        const result = await view.queryParams(req)
        res.render('realTimeProducts', result)
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}

export const profileView = async (req, res) => {
    try {
        const user = req.session.user
        res.render('profile', user)
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}

export const logoutView = async (req, res) => {
    req.session.destroy(err => {
        if(err) return res.send('Logout error')
        return res.redirect('/session/login')
    })   
}