/* import ChatService from '../services/chat.repository.js'

const service = new ChatService()

export const getChat = async (req, res) => {
    try {
        const result = await service.getChat()
        if (result.success){
            const chat = result.chat
            return res.render('chat', {chat})
        }
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
}

export const postMessage = async (req, res) => {
    try {
        const messageData = req.body
        const result = await service.postMessage(messageData)
        if(!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    }
    catch (e) {
        return res.status(500).json({success: false, area: 'Controller', catchError: e.message, detail: e})
    }
} */