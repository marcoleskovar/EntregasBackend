import { Router } from "express"
import passport from "passport"

const router = Router()


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

router.get('/github', passport.authenticate('github', {scope: ['user : email']}), (req, res) => {})

router.get('/githubcallback', passport.authenticate('github' , {failureRedirect: '/githuberror'}),(req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})

router.get('/githuberror', (req, res) => {res.send('GITHUB ERROR')})

router.post('/login', passport.authenticate('login'), async (req, res) => {
    try{
        req.session.user = req.user
        return res.redirect('/products')
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.post('/register', passport.authenticate('register'), async (req, res) => {
    try{
            return res.redirect('/session/login')
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})


export default router