/* import { Router } from "express"
import passport from "passport"
import { getCurrent, getGithub, getGithubCallback, getGithubError, getLogin, getRegister, postLogin, postRegister } from "../controllers/controller.session.js"

const router = Router()

const sessionActive = (req, res, next) => {
    if(req.session?.user) return res.redirect('/products')
    return next()
}

router.get('/login', sessionActive, getLogin)

router.get('/register', sessionActive, getRegister)

router.get('/github', passport.authenticate('github', {scope: ['user : email']}), getGithub)

router.get('/githubcallback', passport.authenticate('github' , {failureRedirect: '/githuberror'}), getGithubCallback)

router.get('/githuberror', getGithubError)

router.get('/current', getCurrent)

router.post('/login', passport.authenticate('login'), postLogin)

router.post('/register', passport.authenticate('register'), postRegister)

export default router */