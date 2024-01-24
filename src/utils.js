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
    const userUsername = await UserService.isInUse('username', username)
    if (!userUsername.success) return userUsername

    const userEmail = await UserService.isInUse('email', email)
    if (!userEmail.success) return userEmail
    
    return userEmail
}

export const validateUser = async (email) => {
    const result = await UserService.getUserByEmail(email)
    return result
}

export const rol = async (email, password) => {
    if(email === config.adminEmail && password === config.adminPassword) return 'admin'
    else return 'user'
} 