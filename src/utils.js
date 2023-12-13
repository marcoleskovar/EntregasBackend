import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from "bcrypt"
import UserModel from './dao/models/user.model.js'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

export const createHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const validatePassword = (user, password) => {
    return bcrypt.compareSync(password, user.password)
}

export const validateUser = async (email) => {
    const userEmail = await UserModel.findOne({email : email})
    if (!userEmail) return {success: false, error: `User not found`}

    return {success: true, user: userEmail}
}
export const existUser = async (username, email) => {
    const userEmail = await UserModel.findOne({email : email})
    if (userEmail) return {success: false, error: `That email is already in use`}
    const user = await UserModel.findOne({username : username})
    if (user) return {success: false, error: `That username is already in use`}

    return {success: true}
}

export const rol = async (email, password) => {
    if(email === 'adminCoder@coder.com' && password === 'adminCod3r123') return 'admin'
    else return 'user'
} 