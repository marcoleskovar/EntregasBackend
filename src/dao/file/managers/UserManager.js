import fs from 'fs'
import cartManager from './CartManager.js'

class UserManager {
    constructor(){
        this._products = []
        this.filename = './dao/file/dataBase/users.json'
        this._format = 'utf-8'
        this.prodManager = new cartManager()
    }

    lastId = async () => {
        try{
            const list = await this.getUsers()
            const maxId = list.reduce((max, product) => {
                return product.id > max ? product.id : max
            }, 0)
            return maxId
        }
        catch (error){
            throw new Error ('No se ha generado un ID')
        }
    }

    fileContent = async (path, format) => {//CHECK
        const list = await fs.promises.readFile(path, format)
        const parse = JSON.parse(list)
        
        if (!Array.isArray(parse)) throw new Error ('La dataBase tiene un formato erroneo')
        
        return parse
    }

    exist = async (property, value) => {
        const users = await this.getUsers()
        switch (property) {
            case 'username':
                const userExist = users.find(u => u.username === value)

                if (!userExist) return null
                else return userExist

            case 'email':
                const emailExist = users.find(u => u.email === value)

                if (!emailExist) return null
                else return emailExist
            case 'id':
                const idExist = users.find(u => u.id === parseInt(value))

                if (!idExist) return null
                else return idExist
            default:
                throw new Error ('Something unexpected happened in Exist function')
        }
    }

    getUsers = async () => {
        if (fs.existsSync(this.filename)){
            this._products = await this.fileContent(this.filename, this._format)
            return this._products
        }else{
            await fs.promises.writeFile(this.filename, '[]', this._format)
            return this._products
        }
    }

    getById = async (id) => {
        const exist = await this.exist('id', id)

        if (!exist) return null
        else return exist
    }

    getByEmail = async (email) => {
        if (!email) throw new Error ('Email field is empty')

        const exist = await this.exist('email', email)

        if (!exist) return null
        else return exist
    }

    getByUsername = async (username) => {
        if (!username) throw new Error ('Username field is empty')

        const exist = await this.exist('username', username)

        if (!exist) return null
        else return exist
    }

    createUser = async (data) => {
        if (Object.keys(data).length === 0) throw new Error ('body vacio')

        for (let i = 0; i <= data.length; i++){
            if(data[i] === null) throw new Error (`${data[i]} is empty`)
        }
    
        const list = await this.getUsers()
        const id = await this.lastId() + 1
        data.id = id
        const pushear = list.push(data)

        if (!pushear) return null

        const write = await fs.promises.writeFile(this.filename, JSON.stringify(list, null, 2))

        if(write === undefined) return data
        else return null
    }
}

export default UserManager