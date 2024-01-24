/* import ChatModel from "../dao/models/model.chat.js"

class ChatService {
    constructor() {
        this.model = ChatModel
    }

    async getChat () {
        const messages = await this.model.find().lean()
        return {success: true, chat: messages}
    }

    async postMessage (data) {
        const message = await this.model.create(data)
        if (!message) return {success: false, area: 'Service', tryError: 'couldnt post message', status: 400}
        else return {success: true, message: message}
    }
}

export default ChatService */