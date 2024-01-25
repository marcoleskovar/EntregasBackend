import { Router } from 'express'
import { getCarts, getCartById, createCart, addToCart, updateCart, updateCartQuant, deleteCart, deleteProdCart } from '../controllers/cart.controller.js'

const router = Router()

router.get('/', getCarts)

router.get('/:cid', getCartById)

router.post('/', createCart)

router.post('/:cid/products/:pid', addToCart)

router.put('/:cid', updateCart)

router.put('/:cid/products/:pid', updateCartQuant)

router.delete('/:cid', deleteCart)

router.delete('/:cid/products/:pid', deleteProdCart)

export default router