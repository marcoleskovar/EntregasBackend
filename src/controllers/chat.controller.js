import { ChatService } from "../services/service.js"
import { error } from "../utils.js"
import { logger } from "../utils/logger.js"

const service = ChatService
const area = 'chatController'

export const getChat = async (req, res) => {
    try {
        const user = req.session.user.username
        const result = await service.getChat()
        const messages = result.result

        if (!result.success) return res.status(result.status).json(result)
        else return res.render('chat', {messages, user})
    } catch (e) {
        const err = await error ('Error in getChat', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}

export const postChat = async (req, res) => {
    try {
        const message = req.body
        const result = await service.postChat(message)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (e) {
        const err = await error ('Error in postChat', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}