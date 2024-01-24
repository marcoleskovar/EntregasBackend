import { Router } from 'express'
import { auth, homeView, logoutView, productsView, profileView, realTimeProductsView } from '../controllers/controller.view.js'

const router = Router()

router.get('/', auth, homeView)

router.get('/products', auth, productsView)

router.get('/realTimeProducts', auth, realTimeProductsView)

router.get('/profile', auth, profileView)

router.get('/logout', auth, logoutView)

export default router