import 'dotenv/config'
import express from 'express'
import proxy from 'express-http-proxy'
import session from 'express-session'
import { createClient } from 'redis'
import connectRedis from 'connect-redis'
import cors from 'cors'
import * as http from 'https'
import logger from './lib/logger.js'
import morgan from 'morgan'
import path from 'path'
import fs from 'fs'
import serviceFactory from './lib/services.js'
import fetch from 'node-fetch'
import { createTerminus } from '@godaddy/terminus'

const httpOptions = {
    key: fs.readFileSync('../etc/mspmr.key'),
    cert: fs.readFileSync('../etc/mspmr.crt')
  }

const corsOptions = {
    origin: `https://${process.env.API_HOST}:${process.env.API_PORT}`,
    methods: 'GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS',
    optionsSuccessStatus: 204,
    credentials: true,
    exposedHeaders: ['set-cookie']
}

const redisOptions = {
    url: process.env.REDIS_SESSION_URL
}

const RedisStore = connectRedis(session)

const redisClient = createClient(redisOptions)
redisClient.connect().catch(console.error)

const sessionOptions = {
    store: new RedisStore({ client: redisClient }),
    secret: process.env.API_SECRET,
    resave: false,
    saveUninitialized: false,
    logErrors: true,
    unset: 'destroy'
}

const app = express();

app.use(session(sessionOptions))
app.use(cors(corsOptions))

// logger setup
var accessLogStream = fs.createWriteStream(path.join(process.env.LOG_PATH, 'access.log'), { flags: 'a' })
// log HTTP errors to the console
app.use(morgan('dev', { skip: function (req, res) { return res.statusCode < 400 }}))
// log everything to the access log
app.use(morgan('combined', { stream: accessLogStream }))

// microservice routes will go here
const services = serviceFactory();
services.data.forEach((s) => {
    logger.info(`Registering '${s.name}' at '${services.meta.apiPrefix}${s.baseUri}'`)
    app.use(`${services.meta.apiPrefix}${s.baseUri}`, proxy(s.serviceUri, {
        proxyReqOptDecorator: function(proxyReqOpts, originalReq) {
            proxyReqOpts.rejectUnauthorized = false
            return proxyReqOpts
        },
        proxyErrorHandler: function(err, res, next) {
            switch (err && err.code) {
                case 'ECONNRESET':
                case 'ECONNREFUSED':
                    return res.status(504).json({ status: 504, message: 'Bad Gateway' })
                    break
                default:
                    next(err)
            }
        }
    }))    
})

// catchall for 404 handling
app.all('*', (req, res) => {
    res.status(404).json({ status: 404, message: 'Not Found' })
})

const httpServer = http.createServer(httpOptions, app)

httpServer.on('clientError', (err, socket) => {
    if (err.code === 'ECONNRESET' || !socket.writable) {
        return
    } else {
        logger.error(`${err.type}: ${err.message}`)
        logger.debug(err.stack)   
    }
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

function onSignal() {
    logger.debug('Cleaning up before shutdown...')
    return Promise.all([
        // cleanup logic goes here
    ])
}

function onShutdown() {
    logger.info('Cleanup complete.  Shutting down...')
}

async function healthCheck({ state }) {
    const status = []
    services.data.forEach((s) => {
         status.push(fetch(`${s.serviceUri}/version`, {
             agent: new http.Agent({ rejectUnauthorized: false })
         }))
    })
    return Promise.all(status)
}

createTerminus(httpServer, {
    healthChecks: {
        '/': healthCheck,
    }, 
    statusOk: 200,
    statusError: 503,
    timeout: 5000,
    onSignal: onSignal,
    onShutdown: onShutdown,
    logger: console.log
})

httpServer.listen(process.env.API_PORT, process.env.API_HOST, () => {
    logger.info(`Server is listening at https://${process.env.API_HOST}:${process.env.API_PORT}`)
})
