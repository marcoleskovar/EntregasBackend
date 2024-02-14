import passport from 'passport'
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import UserDTO from '../dto/file/user.dto.js'
import { createHash, validateUser, existUser, rol, validatePassword } from '../utils.js'
import { UserService, CartService } from '../services/service.js'
import { logger } from '../utils/logger.js'
import { error } from '../utils.js'

const LocalStrategy = local.Strategy

const initPassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, emailParam, password, done) => {
        try {
            const {name, lastname, email, username, age, gender} = req.body
            if (!name || !lastname || !email || !username || !password || !age || !gender){
                logger.error(await error('Empty fields', 400, 'passport'))
                return done ('EMPTY FIELDS', false)
            }
            const exist = await existUser(username, emailParam)
            if(exist.success){
                return done (exist, false)
            }else{
                const wichRol = await rol(emailParam, password)
                const cartId = await CartService.createCart()
                const newUser = {
                    name,
                    lastname,
                    email,
                    username,
                    password: createHash(password),
                    age,
                    gender,
                    role: wichRol,
                    cart: cartId.result._id || cartId.result.id
                }
                const userDTO = new UserDTO(newUser)
                const result = await UserService.createUser(userDTO)
                return done (null, result.result)
            }   
        }
        catch (error) {
            logger.warning(await error('Error to register', 500, 'passport', error))
            return done ('ERROR TO REGISTER: ' + error)
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await validateUser(username)
            if(!user.success){
                logger.warning(await error('Error validating user', 404, 'passport'))
                return done (user.tryError, false)
            }
            if(!validatePassword(user.result, password)){
                logger.warning(await error('Error validating password', 400, 'passport'))
                return done ('INCORRECT PASSWORD', false)
            }
            return done (null, user.result)
        }
        catch(e){
            logger.error(await error('Error to login', 500, 'passport', e))
            return done ('ERROR TO LOGIN: ' + e)
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.e93e620ba6f00b7f',
        clientSecret: '0a76eb30ccbaf5ff98cb45d5cc68f039a833db8f',
        callbackURL: 'http://127.0.0.1:8080/session/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await UserService.getByEmail(profile._json.email)
            if(user.success){
                return done (null, user.result)
            }else{
                const cartId = await CartService.createCart()
                const newUser = {
                    name: profile._json.name,
                    lastname: `${profile._json.name}_lastname`,
                    email: profile._json.email,
                    username: `${profile._json.email}_username`,
                    password: `${profile._json.email}_password`,
                    age: 1,
                    gender: 'undefined',
                    role: 'gitHub-user',
                    cart: cartId.result._id
                }
                const userDTO = new UserDTO(newUser)
                const result = await UserService.createUser(userDTO)
                return done (null, result.result)
            }
        }
        catch(e){
            logger.warning(await error('Error to login with Github', 500, 'passport', e))
            return done ('ERROR TO LOGIN WITH GITHUB' + e)
        }
    }))

    passport.serializeUser((user, done) => {
        done (null, user._id || user.id)
    })

    passport.deserializeUser(async(id, done) => {
        const user = await UserService.getById(id)
        done (null, user.result)
    })
}

export default initPassport