import { Router } from 'express'
import { getUser, roleChange } from '../controllers/user.controller.js'
import { auth } from '../utils.js'

const router = Router()

router.get('/premium/:uid', auth, getUser)

router.post ('/premium/:uid', auth, roleChange)

export default router