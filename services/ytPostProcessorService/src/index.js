import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import amqp from 'amqplib/callback_api'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'

import sessionMiddlewareFactory from '../../common/session'
import { logger, httpLoggerMiddlewareFactory } from '../../common/logger'
import httpServerFactory from '../../common/http'

import youtubeRouter from './youtube.controller'
import { postProcessYoutubeVideo } from './youtube.lib'

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
sessionMiddlewareFactory(app)
httpLoggerMiddlewareFactory(app)

// setup amqp listener
amqp.connect(process.env.AMQP_SERVER_URI).then((conn) => {
    return conn.createChannel().then((channel) => {
        var ok = channel.assertExchange('mspmr.direct', 'direct', { durable: true })
        ok = ok.then(() => {
            return channel.assertQueue('', { exclusive: true })
        })

        ok = ok.then((queue) => {
            return channel.consume(queue, postProcessYoutubeVideo, { noAck: true })
        })

        return ok.then(() => {
            logger.info('[AMQP] Listening for events')
        })
    })
}).catch((err) => {
    logger.error('[AMQP] Fatal: Cannot connect to Event Bus')
    // rethrow since this is a fatal error
    throw err
})

// default route
app.get('/version', (req, res, next) => {
    res.json({ 'service': `${process.env.SERVICE_NAME}`, version: `${process.env.SERVICE_VERSION}` })
    next()
})

app.use('/', youtubeRouter)

const httpServer = httpServerFactory(app)

httpServer.listen(process.env.API_PORT, process.env.API_HOST, () => {
    logger.info(`Server is listening at https://${process.env.API_HOST}:${process.env.API_PORT}`)
})
