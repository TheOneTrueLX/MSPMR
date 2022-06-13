import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'

import sessionMiddlewareFactory from '../../common/session.js'
import { logger, httpLoggerMiddlewareFactory } from '../../common/logger.js'
import httpServerFactory from '../../common/http.js'

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
sessionMiddlewareFactory(app)
httpLoggerMiddlewareFactory(app)

// default route
app.get('/version', (req, res, next) => {
    res.json({ 'service': `${process.env.SERVICE_NAME}`, version: `${process.env.SERVICE_VERSION}` })
    next()
})

// test server route - replace this with the actual server routes
app.get('/', (req, res, next) => {
    res.status(StatusCodes.NOT_IMPLEMENTED).json({ status: StatusCodes.NOT_IMPLEMENTED, message: ReasonPhrases.NOT_IMPLEMENTED })
})

const httpServer = httpServerFactory(app)

httpServer.listen(process.env.API_PORT, process.env.API_HOST, () => {
    logger.info(`Server is listening at https://${process.env.API_HOST}:${process.env.API_PORT}`)
})
