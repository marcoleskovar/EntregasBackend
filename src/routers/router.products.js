import { Router } from 'express'
import { getAllProducts, getById, postProduct, updateProduct, deleteProduct } from '../controllers/controller.products.js'

const router = Router()

router.get('/', getAllProducts)

router.get('/:pid', getById)

router.post('/', postProduct)

router.put('/:pid', updateProduct)

router.delete('/:pid', deleteProduct)

export default router