class ChatRepository {
    constructor(dao) {
        this.dao = dao
    }

    //IF SUCCESS
    async success (message, data) {
        const result = {success: true, message: message, result: data}
        return result
    }

    //IF ERROR
    async error (message, status) {
        const result = {success: false, area: 'Chat-Service', tryError: message, status: status}
        return result
    }

    async getChat () {
        const messages = await this.dao.getChat()
        return await this.success('Se cargaron todos los chats', messages)
    }

    async postChat (data, user) {
        const newMessage = {
            user,
            message: data
        }
        const message = await this.dao.postChat(newMessage)

        if (!message) return await this.error('Ha ocurrido un error al postear un mensaje', 500)
        else return await this.success('Se ha creado el mensaje', message)
    }
}

export default ChatRepository