import { Router } from 'express'
import { homeView, logoutView, productsView, profileView, realTimeProductsView, cartView } from '../controllers/view.controller.js'
import { auth, authRole } from '../utils.js'

const router = Router()

router.get('/', auth, homeView)

router.get('/products', auth, productsView)

router.get('/realTimeProducts', auth, authRole('admin'), realTimeProductsView)

router.get('/cart', auth, cartView)

router.get('/profile', auth, profileView)

router.get('/logout', auth, logoutView)

export default router