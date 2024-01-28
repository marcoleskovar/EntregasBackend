import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { UserService } from './services/service.js'
import bcrypt from "bcrypt"
import config from './config/config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const validatePassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

export const existUser = async (username, email) => {
    if (!username || !email) throw new Error ('Either username or email are empty')

    const userUsername = await UserService.getByUsername(username)
    if (userUsername.success) throw new Error ('Username already in use')

    const userEmail = await UserService.getByEmail(email)
    if (userEmail.success) throw new Error ('Email already in use')
    
    return userEmail
}

export const validateUser = async (email) => {
    const result = await UserService.getByEmail(email)
    return result
}

export const rol = async (email, password) => {
    if(email === config.adminEmail && password === config.adminPassword) return 'admin'
    else return 'user'
} 