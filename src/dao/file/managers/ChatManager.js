import fs from 'fs'
import { logger } from '../../../utils/logger.js'

class ChatManager {
    constructor(){
        this._products = []
        this.filename = './dao/file/dataBase/chat.json'
        this._format = 'utf-8'
        this.area = 'ChatManager'
    }

    lastId = async () => {
        try{
            const list = await this.getChat()
            const maxId = list.reduce((max, product) => {
                return product.id > max ? product.id : max
            }, 0)
            return maxId
        }
        catch (e){
            logger.fatal(await error('No se ha generado un ID', 500, this.area, e))
            throw new Error ('No se ha generado un ID')
        }
    }

    fileContent = async (path, format) => {
        const list = await fs.promises.readFile(path, format)
        if (list.trim() === '') {
            logger.fatal(await error(`La databse ${this.filename} no tiene ningun dato`, 500, this.area))
            throw new Error (`La dataBase ${this.filename} no tiene ningun dato`)
        }
        const parse = JSON.parse(list)
        
        if (!Array.isArray(parse)){
            logger.fatal(await error(`La database ${this.filename} tiene un formato erroneo`, 500, this.area))
            throw new Error ('La dataBase tiene un formato erroneo')
        }
        
        return parse
    }

    getChat = async () => {
        if (fs.existsSync(this.filename)){
            this._products = await this.fileContent(this.filename, this._format)
            return this._products
        }else{
            await fs.promises.writeFile(this.filename, '[]', this._format)
            return this._products
        }
    }

    postChat = async (data) => {
        const list = await this.getChat()
        const id = await this.lastId() + 1

        data.id = id
        const pushear = list.push(data)

        if (!pushear) {
            logger.error(await error('Error posting a message', 500, this.area))
            return null
        }
        
        const write = await fs.promises.writeFile(this.filename, JSON.stringify(list, null, 2))
        if (write === undefined) return data
        else {
            logger.error(await error(`Error writing in ${this.filename}`, 500, this.area))
            return null
        }
    }
}

export default ChatManager