export default class UserRepository {
    constructor (dao) {
        this.dao = dao
    }

    async success (message, data) {
        const result = {success: true, message: message, result: data}
        return result
    }

    async error (message, status) {
        const result = {success: false, area: 'User-Service', tryError: message, status: status}
        return result
    }

    async getUsers () {
        const users = await this.dao.getUsers()

        return await this.success('Se han encontrado correctamente los usuarios', users)
    }

    async getUserById (id) {
        if (id < 0) return await this.error('ID has to be above 0', 400)

        const userById = await this.dao.getUserById(id)

        if (userById === null) return await this.error( 'UserID not found', 404)
        else return await this.success('El usuario se encontro correctamente por ID', userById)
    }

    async getUserByEmail (email) {
        if (!email) return await this.error('Email is not valid', 400)

        const userByEmail = await this.dao.getUserByEmail(email)

        if (userByEmail === null) return await this.error( 'User email not found', 404)
        else return await this.success('El usuario se encontro correctamente por email', userByEmail)
    }

    async getUserByUsername (username) {
        if (!username) return await this.error('Username is not valid', 400)

        const userByUsername = await this.dao.getUserByUsername(username)

        if (userByUsername === null) return await this.error( 'Username not found', 404)
        else return await this.success('El usuario se encontro correctamente por username', userByUsername)
    }

    async createUser (data) {
        const create = await this.dao.createUser(data)
        
        if(!create) return await this.error('No se ha creado correctamente el usuario', 400)
        else return await this.success('Se ha creado correctamente el usuario', create)
    }

    async isInUse (property, value) {
        switch (property) {
            case 'username':
                const usernameRes = await this.getUserByUsername(value)

                if (usernameRes.success) return await this.error('That username is already in use', 400)
                else return await this.success('username available', usernameRes.result)
            
            case 'email':
                const emailRes = await this.getUserByEmail(value)

                if (emailRes.success) return await this.error('That email is already in use', 400)
                else return await this.success('email available', emailRes.result)
            default:
                return await this.error('Error in "isInUse" function', 500)
        }
    }
}