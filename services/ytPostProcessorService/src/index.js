import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import amqp from 'amqplib/callback_api'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import fs from 'fs'
import * as url from 'url'

import { sessionMiddlewareFactory } from '../../common/session.js'
import { logger, httpLoggerMiddlewareFactory } from '../../common/logger.js'
import httpServerFactory from '../../common/http.js'

import youtubeRouter from './youtube.controller.js'
import { postProcessYoutubeVideo } from './youtube.lib.js'

const config = JSON.parse(fs.readFileSync(url.fileURLToPath(new URL('.', import.meta.url)) + '/config.json'))[process.env.NODE_ENV]

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
sessionMiddlewareFactory(app)
httpLoggerMiddlewareFactory(app, config.logPath)

// setup amqp listener
amqp.connect(process.env.AMQP_SERVER_URI, (err, conn) => {
    if(err) throw err
    conn.createChannel((err, channel) => {
        if(err) throw err
        const exchange = channel.assertExchange('mspmr.direct', 'direct', { durable: true })
        channel.assertQueue('', { exclusive: true })
        channel.consume(exchange.queue, postProcessYoutubeVideo, { noAck: true })
        logger.info('[AMQP] Listening for events')
    })
})

// default route
app.get('/internal/version', (req, res) => {
    res.json({ 'service': `${config.serviceName}`, version: `${config.serviceVersion}` }).end()
})

app.use('/', youtubeRouter)

// catchall for 404 handling
app.all('*', (req, res) => {
    res.status(404).json({ status: 404, message: 'Not Found' }).end()
})

const httpServer = httpServerFactory(app)

httpServer.listen(config.port, config.host, () => {
    logger.info(`Server is listening at https://${config.host}:${config.port}`)
})
