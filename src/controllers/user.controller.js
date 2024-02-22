import { error } from "../utils.js"
import { logger } from "../utils/logger.js"
import { UserService } from "../services/service.js"

const area = 'userController'

export const getUser = async (req, res) => {
    try {
        const user = req.session.user
        res.render('rolechange', {user})
    } catch (e) {
        const err = await error ('Error in getUser', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}

export const roleChange = async (req, res) => {
    try {
        const role = req.body
        const id = req.params.uid
        const find = await UserService.getById(id)

        if (!find.success) return await error ('El usuario no existe', 500, area)

        const result = await UserService.updateUser(find.result.email, role)
        
        if (!result.success) return res.status(result.status).json(result)
        else return res.status(200).json(result)
    } catch (e) {
        const err = await error ('Error in roleChange', 500, area, e)
        logger.error (err)
        return res.status(500).json(err)
    }
}