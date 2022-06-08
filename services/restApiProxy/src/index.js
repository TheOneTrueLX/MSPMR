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
import serviceFactory from './lib/router.js'
import axios from 'axios'


const httpOptions = {
    key: fs.readFileSync('../../etc/mspmr.key'),
    cert: fs.readFileSync('../../etc/mspmr.crt')
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
var accessLogStream = fs.createWriteStream(path.join('./logs', 'access.log'), { flags: 'a' })
// log HTTP errors to the console
app.use(morgan('dev', { skip: function (req, res) { return res.statusCode < 400 }}))
// log everything to the access log
app.use(morgan('combined', { stream: accessLogStream }))

// microservice routes will go here
const services = serviceFactory();
const httpAgent = new http.Agent({ rejectUnauthorized: false })
var statusArray = []
services.data.forEach((s) => {
    logger.info(`Registering '${s.name}' at '${services.meta.apiPrefix}${s.baseUri}'`)
    axios.get(`${s.serviceUri}/version`, { httpsAgent: httpAgent }).then((res) => {
        statusArray.push({ service: res.data.service, version: res.data.version })
    }).catch((err) => {
        logger.error(`Service '${s.name}' appears to be offline`)
    })
    app.use(`${services.meta.apiPrefix}${s.baseUri}`, proxy(s.serviceUri, {
        proxyReqOptDecorator: function(proxyReqOpts, originalReq) {
            proxyReqOpts.rejectUnauthorized = false
            return proxyReqOpts
        }
    }))
})

// default route
app.get('/', (req, res, next) => {
    services.data.forEach((s) => {

    })    
    res.json(statusArray)
})

const httpServer = http.createServer(httpOptions, app)

httpServer.on('clientError', (err, socket) => {
    logger.error(err)
    if (err.code === 'ECONNRESET' || !socket.writable) {
        return
    }
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

httpServer.listen(process.env.API_PORT, process.env.API_HOST, () => {
    logger.info(`Server is listening at https://${process.env.API_HOST}:${process.env.API_PORT}`)
    statusArray.push({ service: `${process.env.SERVICE_NAME}`, version: `${process.env.SERVICE_VERSION}` })
})
