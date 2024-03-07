import { createHash, error, success, validatePassword } from "../utils.js"
import { logger } from "../utils/logger.js"
import Mail from "../modules/mail.module.js"

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

    async updateUser (mail, data) {
        const oldUser = await this.getByEmail(mail) 
        if (!oldUser.success) return oldUser

        const toUpdate = {
            query: {email: mail},
            update: {$set: data},
            options: {new: true}
        }
        const newUser = await this.dao.updateUser(toUpdate)
        if (!newUser) return await error ('No se ha modificado correctamente el usuario', 400, this.area)
        else return await success ('Se ha modificado correctamente el usuario', newUser, this.area)
    }

    async recoverMail (data, link) {
        const userMail = data.email
        const existUser = await this.getByEmail(userMail)
        if (!existUser.success) return existUser
        let html = `Hola ${existUser.result.name}, 
            <a href="${link}">Haga click para reestablecer su contraseña</a>`

        const result = new Mail().send(userMail, "Reestablecer contraseña", html)
        return await success ('Se ha enviado el mail', result, this.area)
    }

    async recover (email, passwords) {
        const user = await this.getByEmail(email.email)
        if (passwords.pass_1 !== passwords.pass_2) return await error ('Ambas contraseñas deben ser iguales', 400, this.area)
        const pass = validatePassword (user.result, passwords.pass_1)
        if (pass) return await error ('No puedes ingresar la misma contraseña que tenias antes', 400, this.area)
        const newPass = createHash (passwords.pass_1)
        const update = await this.updateUser(email.email, {password: newPass})
        if (update) return await success ('Se ha modificado la contraseña correctamente', newPass, this.area)
    }
}