import CurrentDTO from "../dto/file/current.dto.js"

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
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
}

export const postRegister = async (req, res) => {
    try {
        return res.redirect('/session/login')
    }
    catch (e) {
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
}