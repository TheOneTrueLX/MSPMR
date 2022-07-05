const pino = require('pino')
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

const pinoConfig = {
    production: {
        name: process.env.SERVICE_NAME,
        level: process.env.LOG_LEVEL || 'info',
        timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
    },
    development: {
        name: process.env.SERVICE_NAME,
        level: process.env.LOG_LEVEL || 'info',
        timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
        transport: {
            target: 'pino-pretty',
            options: { colorize: true }
        }
    }
}

const logger = pino(pinoConfig[process.env.NODE_ENV]);

function httpLoggerMiddlewareFactory(app, logpath) {
    const accessLogStream = fs.createWriteStream(path.join(logpath, 'access.log'), { flags: 'a' })
    if(process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'))
    } else {
        app.use(morgan('dev', { skip: function (req, res) { return res.statusCode < 400 }}))
    }
    app.use(morgan('combined', { stream: accessLogStream }));
}

module.exports = {
    logger,
    httpLoggerMiddlewareFactory
}