import { ChatService } from "../services/service.js"

const service = ChatService

const controllerError = async (e) => {
    const result = {success: false, area: 'Chat-Controller', catchError: e.message, detail: e}
    return result
}

export const getChat = async (req, res) => {
    try {
        const user = req.session.user.username
        const result = await service.getChat()
        const messages = result.result

        if (!result.success) return res.status(result.status).json(result)
        else return res.render('chat', {messages, user})
    } catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}

export const postChat = async (req, res) => {
    try {
        const message = req.body
        const result = await service.postChat(message)

        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (error) {
        const err = await controllerError(error)
        return res.status(500).json(err)
    }
}