import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import fs from 'fs'
import * as url from 'url'

import { sessionMiddlewareFactory } from '../../common/session.js'
import httpServerFactory from '../../common/http.js '
import { logger, httpLoggerMiddlewareFactory } from '../../common/logger.js'

// import routers here
import authRouter from './auth.controller.js'

// import config
const config = JSON.parse(fs.readFileSync(url.fileURLToPath(new URL('.', import.meta.url)) + '/config.json'))[process.env.NODE_ENV]

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
sessionMiddlewareFactory(app)
httpLoggerMiddlewareFactory(app, config.logPath)

// default route
app.get('/internal/version', (req, res) => {
    res.json({ 'service': `${config.serviceName}`, version: `${config.serviceVersion}` }).end()
})

// set up routers here
app.use('/', authRouter)

// catchall for 404 handling
app.all('*', (req, res) => {
    res.status(404).json({ status: 404, message: 'Not Found' }).end()
})

const httpServer = httpServerFactory(app)

httpServer.listen(config.port, config.host, () => {
    logger.info(`Server is listening at https://${config.host}:${config.port}`)
})
