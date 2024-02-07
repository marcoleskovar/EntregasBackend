import { Router } from 'express'
import { getChat, postChat } from '../controllers/chat.controller.js'
import { auth, authRole } from '../utils.js'

const router = Router()

router.get('/', auth, authRole('user'), getChat)

router.post('/', auth, authRole('user'), postChat)

export default router