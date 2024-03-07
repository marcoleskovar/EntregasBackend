import CurrentDTO from "../dto/file/current.dto.js"
import { UserService } from "../services/service.js"
import { error, success } from "../utils.js"
import { logger } from "../utils/logger.js"
import jwt from 'jsonwebtoken'

export const getLogin = (req, res) => {
    res.render('login', {})
}

export const getRegister = (req, res) => {
    res.render('register', {})
}

export const getGithub = (req, res) => {}

export const getGithubCallback = (req, res) => {
    req.session.user = req.user
    res.redirect('/products')
}

export const getGithubError = (req, res) => {
    {res.send('GITHUB ERROR')}
}

export const getCurrent = (req, res) => {
    const user = new CurrentDTO(req.session.user)
    return res.send(user)
}

export const postLogin = async (req, res) => {
    try {
        req.session.user = req.user
        return res.redirect('/products')
    }
    catch (e) {
        const err = await error ('Error in postLogin', 500, 'sessionController', e)
        logger.error (err)
        return res.status(500).json(err)
    }
}

export const postRegister = async (req, res) => {
    try {
        return res.redirect('/session/login')
    }
    catch (e) {
        const err = await error ('Error in postRegister', 500, 'sessionController', e)
        logger.error (err)
        return res.status(500).json(err)
    }
}

export const recoverMail = async (req, res) => {
    try {
        const email = req.body
        const token = jwt.sign({email}, 'secret', {expiresIn: '1h'})
        const newLink = `http://127.0.0.1:8080/recover/${token}`
        const result = await UserService.recoverMail(email, newLink)
        if (!result.success) return res.status(result.status).send(result)
        else return res.status(200).send({result, token})
    } catch (e) {
        const err = await error ('Error in recoverMail', 500, 'sessionController', e)
        logger.error (err)
        return res.status(500).json(err)
    }
}

export const recover = async (req, res) => {
    try {
        const token = req.params.token
        jwt.verify(token, 'secret', async (err, decoded) => {
            if (err) return res.render('error_recover', {})
            const passwords = await UserService.recover(decoded.email, req.body)
            if (!passwords.success) {
                return res.status(passwords.status).json(passwords)
            }else{
                res.status(200).write('SUCCESS')
                return 
            } 
        })
        return res.redirect('/session/login')
    } catch (e) {
        const err = await error ('Error in recover', 500, 'sessionController', e)
        logger.error (err)
        return res.status(500).json(err)
    }
}