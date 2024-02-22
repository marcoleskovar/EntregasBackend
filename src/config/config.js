import dotenv from 'dotenv'

dotenv.config()

export default {
    persistence: process.env.PERSISTENCE,
    port: process.env.PORT || 8080,
    mongoURL: process.env.MONGO_URL,
    dbName: process.env.DB_NAME,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    premiumEmail: process.env.PREMIUM_EMAIL,
    mail: process.env.MAIN_MAIL,
    mailPassword: process.env.MAIN_MAIL_PASS,
}