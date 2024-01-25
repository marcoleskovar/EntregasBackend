import dotenv from 'dotenv'

dotenv.config()

export default {
    persistence: process.env.PERSISTENCE,
    port: process.env.PORT || 8080,
    mongoURL: process.env.MONGO_URL,
    dbName: process.env.DB_NAME,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD
}