import { opts } from "../config/commander.js"
import winston from "winston"
import color from 'cli-color'
import moment from "moment"

const enviroment = opts.env === 'DEV'
const custom = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: color.bgRed,
        error:  color.bold.red,
        warning:  color.underline.yellow,
        info:  color.italic.magenta,
        http:  color.blue,
        debug:  color.green
    }
}

const customFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    const logObject = {
        level : `[${level.toUpperCase()}]`,
        message,
        success: metadata.success || false,
        timestamp: moment().format('DD-MM-YYYY / HH:mm'),
        status: metadata.status || 500,
        area: metadata.area || null,
        detail: metadata.detail || null
    }

    return JSON.stringify(logObject, null, 2)
})

export const logger = winston.createLogger({
    levels: custom.levels,
    transports: [
        new winston.transports.Console({
            level: enviroment ? 'debug' : 'info',
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.printf(({ level, message }) => {
                    const coloredLevel = custom.colors[level](`[${level.toUpperCase()}]`)
                    return `${coloredLevel} ${message}`
                })
            )
        }),
        new winston.transports.File({
            filename: './errors.log', 
            level: 'error',
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                customFormat
            )
            
        })
    ]
})

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.http(`[${req?.method}] ${req?.url} - ${new Date().toLocaleTimeString()}`)
    next()
}