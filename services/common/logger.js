import pino from 'pino'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'

export const logger = pino({
    name: process.env.SERVICE_NAME,
    level: process.env.LOG_LEVEL,
    timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`
});


export function httpLoggerMiddlewareFactory(app, logpath) {
    const accessLogStream = fs.createWriteStream(path.join(logpath, 'access.log'), { flags: 'a' })
    app.use(morgan('dev', { skip: function (req, res) { return res.statusCode < 400 }}))
    app.use(morgan('combined', { stream: accessLogStream }))
}