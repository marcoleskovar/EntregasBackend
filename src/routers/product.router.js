import { Router } from 'express'
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js'
import {auth, authRole} from '../utils.js'

const router = Router()

router.get('/', auth, getProducts)

router.get('/:pid', auth, getProductById)

router.post('/', auth, authRole('admin', 'premium'), createProduct)

router.put('/:pid', auth, authRole('admin'), updateProduct)

router.delete('/:pid', auth, authRole('admin', 'premium'), deleteProduct)

export default router