import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import fs from 'fs'
import * as url from 'url'

import { sessionMiddlewareFactory } from '../../common/session.js'
import { logger, httpLoggerMiddlewareFactory } from '../../common/logger.js'
import httpServerFactory from '../../common/http.js'

import videoRouter from './video.controller.js'

const config = JSON.parse(fs.readFileSync(url.fileURLToPath(new URL('.', import.meta.url)) + '/config.json'))[process.env.NODE_ENV]

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
sessionMiddlewareFactory(app)
httpLoggerMiddlewareFactory(app, config.logPath)

// default route
app.get('/version', (req, res, next) => {
    res.json({ 'service': `${config.serviceName}`, version: `${config.serviceVersion}` })
    next()
})

// test server route - replace this with the actual server routes
app.use('/', videoRouter)

const httpServer = httpServerFactory(app)

httpServer.listen(config.port, config.host, () => {
    logger.info(`Server is listening at https://${config.host}:${config.port}`)
})
