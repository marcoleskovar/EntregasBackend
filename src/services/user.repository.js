import { error, success } from "../utils.js"
import { logger } from "../utils/logger.js"

export default class UserRepository {
    constructor (dao) {
        this.dao = dao
        this.area = 'userRepository'
    }

    async getUsers () {
        const result = await this.dao.getUsers()

        return await success ('Se han encontrado correctamente los usuarios', result, this.area)
    }

    async getById (id) {
        if (id < 0) return await error('ID has to be above 0', 400, this.area)

        const result = await this.dao.getById(id)

        if (!result) {
            const err = await error('UserID not found', 404, this.area)
            logger.warning(err)
            return err
        }
        else return await success('El usuario se encontro correctamente por ID', result, this.area)
    }

    async getByEmail (email) {
        const result = await this.dao.getByEmail(email)
        if (!result) {
            const err = await error('Email not found', 404, this.area)
            logger.warning(err)
            return err
        }
        else return await success('El usuario se encontro correctamente por email', result, this.area)
    }

    async getByUsername (username) {
        const result = await this.dao.getByUsername(username)

        if (!result) return await error('Username not found', 404, this.area)
        else return await success('El usuario se encontro correctamente por username', result, this.area)
    }

    async createUser (data) {
        const result = await this.dao.createUser(data)
        
    if(!result) {
        const err = await error('No se ha creado correctamente el usuario', 500, this.area)
        logger.error(err)
        return err
    }
        else return await success('Se ha creado correctamente el usuario', result, this.area)
    }
}