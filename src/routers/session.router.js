import { Router } from "express"
import UserModel from "../dao/models/user.model.js"

const router = Router()


const validateUser = async (user, password) => {
    const username = await UserModel.findOne({username : user})
    if (!username) return {success: false, error: `User not found`}
    const userPassword = username.password === password
    if (!userPassword) return {success: false, error: `Incorrect password`}
    
    return {success: true, user: username}
}

const existUser = async (username, email) => {
    const userEmail = await UserModel.findOne({email : email})
    if (userEmail) return {success: false, error: `That email is already in use`}
    const user = await UserModel.findOne({username : username})
    if (user) return {success: false, error: `That username is already in use`}
    
    return {success: true}
}

const sessionActive = (req, res, next) => {
    if(req.session?.user) return res.redirect('/products')
    return next()
}

router.get('/login', sessionActive, (req, res) => {
    res.render('login', {})
})

router.get('/register', sessionActive, (req, res) => {
    res.render('register', {})
})

router.post('/login', async (req, res) => {
    try{
        const {username, password} = req.body
        if (!username || !password) return res.status(401).json({error: `Empty fields`})
        const user = await validateUser(username, password)
        if(user.success === false) return res.status(401).json({error: user.error})
        else req.session.user = user.user
        return res.redirect('/products')
}
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.post('/register', async (req, res) => {
    try{
        const {name, lastname, email, username, password, age, gender} = req.body
        if (!name || !lastname || !email || !username || !password || !age || !gender) return res.status(401).json({error: `Empty fields`})
        const exist = await existUser(username, email)
        if(exist.success === false) {
            return res.status(401).json({error: exist.error})
        }else{
            const newUser = {
                name,
                lastname,
                email,
                username,
                password,
                age,
                gender
            }
            await UserModel.create(newUser)
            return res.redirect('/session/login')
        }
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})


export default router