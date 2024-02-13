import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { UserService } from './services/service.js'
import {faker} from '@faker-js/faker'
import CurrentDTO from './dto/file/current.dto.js'
import bcrypt from "bcrypt"
import config from './config/config.js'
import { logger, errorToLogger } from './utils/logger.js'

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
    if (userUsername.success) {
        logger.warning(await errorToLogger('Username already in use', 409, 'utils'))
        throw new Error ('Username already in use')
    }

    const userEmail = await UserService.getByEmail(email)
    if (userEmail.success) {
        logger.warning(await errorToLogger('Email already in use', 409, 'utils'))
        throw new Error ('Email already in use')
    }
    
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

export const auth = (req, res, next) => {
    if (req.session?.user) return next()
    res.redirect('/session/login')
}

export const authRole = (role) => {
    return async (req, res, next) => {
        const user = new CurrentDTO (req.session.user)
        if (user.role != role) return res.status(401).json({ error: 'Unauthorized' })
        return next()
    }
}

export const generateMockingProds = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        thumbnail: [faker.image.url()],
        code: Math.random().toString(32).substring(7),
        category: faker.commerce.productMaterial(),
        stock: faker.number.int({max: 100}),
        status: true,
    }
}