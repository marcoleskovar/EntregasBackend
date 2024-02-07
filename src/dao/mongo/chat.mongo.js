import ChatModel from "./models/chat.model.js"

export default class Chat {
    constructor () {this.model = ChatModel}
    async getChat () {return this.model.find().lean()}
    async postChat (message) {return this.model.create(message)}
}