import { Router } from 'express'
import mongoose from 'mongoose'
import CartModel from '../dao/models/model.cart.js'
import { addToCart, deleteCart, deleteProdCart, getAllCart, getCartById, postCart, updateCart, updateCartQuant } from '../controllers/controller.cart.js'

const router = Router()

router.get('/', getAllCart)//CHECK-DONE

router.get('/:cid', getCartById)//CHECK-DONE

router.post('/', postCart)//CHECK-DONE

router.post('/:cid/products/:pid', addToCart)//CHECK-DONE

router.put('/:cid', updateCart)//CHECK-DONE

router.put('/:cid/products/:pid', updateCartQuant)

router.delete('/:cid', deleteCart)//CHECK-DONE

router.delete('/:cid/products/:pid', deleteProdCart)//CHECK-DONE

export default router