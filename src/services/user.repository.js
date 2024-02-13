import { errorToLogger, logger } from "../utils/logger.js"

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
        const result = await this.dao.getUsers()

        return await this.success('Se han encontrado correctamente los usuarios', result)
    }

    async getById (id) {
        if (id < 0) return await this.error('ID has to be above 0', 400)

        const result = await this.dao.getById(id)

        if (!result) {
            logger.warning(await errorToLogger('UserID not found', 404, 'userRepository'))
            return await this.error( 'UserID not found', 404)
        }
        else return await this.success('El usuario se encontro correctamente por ID', result)
    }

    async getByEmail (email) {
        const result = await this.dao.getByEmail(email)

        if (!result) {
            logger.warning(await errorToLogger('Email not found', 404, 'userRepository'))
            return await this.error( 'Email not found', 404)
        }
        else return await this.success('El usuario se encontro correctamente por email', result)
    }

    async getByUsername (username) {
        const result = await this.dao.getByUsername(username)

        if (!result) return await this.error( 'Username not found', 404)
        else return await this.success('El usuario se encontro correctamente por username', result)
    }

    async createUser (data) {
        const result = await this.dao.createUser(data)
        
    if(!result) {
        logger.error(await errorToLogger('No se ha creado correctamente el usuario', 500, 'userRepository'))
        return await this.error('No se ha creado correctamente el usuario', 500)
    }
        else return await this.success('Se ha creado correctamente el usuario', result)
    }
}