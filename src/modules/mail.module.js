import config from "../config/config.js"
import nodemailer from 'nodemailer'

export default class Mail {
    constructor () {
        this.transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            auth: {
                user: config.mail,
                pass: config.mailPassword
            }
        })
    }

    async send (user, subject, html) {
        const opts = {
            from: config.mail,
            to: user,
            subject,
            html
        }

        const result = await this.transport.sendMail(opts)
        return result
    }
}