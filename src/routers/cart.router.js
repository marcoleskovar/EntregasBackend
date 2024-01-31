import { Router } from 'express'
import { getCarts, getCartById, createCart, addToCart, updateCart, updateCartQuant, deleteCart, deleteProdCart, purchaseCart,  } from '../controllers/cart.controller.js'
import { auth, authRole } from '../utils.js'

const router = Router()

router.get('/', auth, getCarts)

router.get('/:cid', auth, getCartById)

router.post('/', createCart)

router.post('/:cid/products/:pid', auth, authRole('user'), addToCart)

router.put('/:cid', auth, updateCart)

router.put('/:cid/products/:pid', auth, updateCartQuant)

router.delete('/:cid', auth, deleteCart)

router.delete('/:cid/products/:pid', auth, deleteProdCart)

router.post('/:cid/purchase', auth, purchaseCart)

export default router