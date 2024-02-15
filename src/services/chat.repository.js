import { error, success } from "../utils.js"

class ChatRepository {
    constructor(dao) {
        this.dao = dao
        this.area = 'chatRepository'
    }

    async getChat () {
        const messages = await this.dao.getChat()
        return await success('Se cargaron todos los chats', messages, this.area)
    }

    async postChat (data) {
        const message = await this.dao.postChat(data)

        if (!message) return await error('Ha ocurrido un error al postear un mensaje', 500, this.area)
        else return await success('Se ha creado el mensaje', message, this.area)
    }
}

export default ChatRepository