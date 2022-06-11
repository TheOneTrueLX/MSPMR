import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'

import sessionMiddlewareFactory from '../../common/session.js'
import httpServerFactory from '../../common/http.js '
import { logger, httpLoggerMiddlewareFactory } from '../../common/logger.js'

// import routers here
import authRouter from './controllers/auth.js'

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
sessionMiddlewareFactory(app)
httpLoggerMiddlewareFactory(app)

// set up routers here
app.use('/', authRouter)

const httpServer = httpServerFactory(app)

httpServer.listen(process.env.API_PORT, process.env.API_HOST, () => {
    logger.info(`Server is listening at https://${process.env.API_HOST}:${process.env.API_PORT}`)
})
