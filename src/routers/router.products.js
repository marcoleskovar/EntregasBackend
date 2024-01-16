import { Router } from 'express'
import { getAllProducts, getProductById, postProduct, updateProduct, deleteProduct } from '../controllers/controller.products.js'

const router = Router()

router.get('/', getAllProducts)//CHECK-DONE

router.get('/:pid', getProductById)//CHECK-DONE

router.post('/', postProduct)//CHECK-DONE

router.put('/:pid', updateProduct)//CHECK-DONE

router.delete('/:pid', deleteProduct)//CHECK-DONE

export default router