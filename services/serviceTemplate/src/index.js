import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import session from 'express-session'
import { createClient } from 'redis'
import connectRedis from 'connect-redis'
import * as http from 'https'
import logger from './lib/logger.js'
import morgan from 'morgan'
import path from 'path'
import fs from 'fs'

const httpOptions = {
    key: fs.readFileSync('../etc/mspmr.key'),
    cert: fs.readFileSync('../etc/mspmr.crt')
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

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session(sessionOptions))

// logger setup
var accessLogStream = fs.createWriteStream(path.join(process.env.LOG_PATH, 'access.log'), { flags: 'a' })
// log HTTP errors to the console
app.use(morgan('dev', { skip: function (req, res) { return res.statusCode < 400 }}))
// log everything to the access log
app.use(morgan('combined', { stream: accessLogStream }))

// default route
app.get('/version', (req, res, next) => {
    res.json({ 'service': `${process.env.SERVICE_NAME}`, version: `${process.env.SERVICE_VERSION}` })
    next()
})

// test server route - replace this with the actual server routes
app.get('/', (req, res, next) => {
    res.json({ message: 'This is a test' })
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

httpServer.listen(process.env.API_PORT, process.env.API_HOST, () => {
    logger.info(`Server is listening at https://${process.env.API_HOST}:${process.env.API_PORT}`)
})
