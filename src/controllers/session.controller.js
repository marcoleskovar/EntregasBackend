import CurrentDTO from "../dto/file/current.dto.js"
import { error } from "../utils.js"
import { logger } from "../utils/logger.js"

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
    if(req.session?.user){
        const user = new CurrentDTO(req.session.user)
        return res.send(user)
    }
    else res.redirect('/session/login')
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