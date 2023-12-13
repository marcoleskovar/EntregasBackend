import passport from 'passport'
import local from 'passport-local'
import UserModel from '../dao/models/user.model.js'
import { createHash, validatePassword, validateUser, existUser, rol } from '../utils.js'

const LocalStrategy = local.Strategy

const initPassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, emailParam, password, done) => {
        try {
            const {name, lastname, email, username, age, gender} = req.body
            if (!name || !lastname || !email || !username || !password || !age || !gender){
                return done ('EMPTY FIELDS', false)
            }
            const exist = await existUser(username, emailParam)
            if(exist.success === false){
                return done (exist.error, false)
            }else if (exist.success === true){
                const wichRol = await rol (emailParam, password)
                const newUser = {
                    name,
                    lastname,
                    email,
                    username,
                    password: createHash(password),
                    age,
                    gender,
                    role: wichRol
                }
                const result = await UserModel.create(newUser)
                return done (null, result)
            }   
        }
        catch (e) {
            return done ('ERROR TO REGISTER: ' + e)
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await validateUser(username)
            if(user.success === false){
                return done (user.error, false)
            }
            if(!validatePassword(user.user, password)){
                return done ('INCORRECT PASSWORD', false)
            }
            return done (null, user.user)
        }
        catch(e){
            return done ('ERROR TO LOGIN: ' + e)
        }
    }))

    passport.serializeUser((user, done) => {
        done (null, user._id)
    })

    passport.deserializeUser(async(id, done) => {
        const user = await UserModel.findById(id)
        done (null, user)
    })
}

export default initPassport