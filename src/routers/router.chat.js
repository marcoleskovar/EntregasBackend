import { Router } from 'express'
import ChatModel from '../dao/models/model.chat.js'

const router = Router()

router.get('/', async (req, res) => {
    try{
        const messages = await ChatModel.find().lean().exec()
        res.render('chat', {messages})
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

router.post('/', async (req, res) => {
    try{
        const messageData = req.body
        const addMessage = await ChatModel.create(messageData)
        if(addMessage){
            return res.status(200).json({succes: true,  message: 'Se ha agregado correctamente el mensaje'})
        }else{
            return res.status(500).json({succes: false, error: 'No se ha agregado correctamente el mensaje'})
        }   
    }
    catch(e){
        return res.status(500).json({success: false, error: e.message, detail: e})
    }
})

export default router