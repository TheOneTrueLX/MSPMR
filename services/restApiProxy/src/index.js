import 'dotenv/config'
import express from 'express'
import proxy from 'express-http-proxy'
import fetch from 'node-fetch'
import { createTerminus } from '@godaddy/terminus'
import { Agent as httpAgent } from 'https'

import httpServerFactory from '../../common/http'
import sessionMiddlewareFactory from '../../common/session'
import corsMiddlewareFactory from '../../common/cors'
import { logger, httpLoggerMiddlewareFactory } from '../../common/logger'

import serviceFactory from './lib/services'


const app = express();

sessionMiddlewareFactory(app)
corsMiddlewareFactory(app)
httpLoggerMiddlewareFactory(app)

// microservice routes will go here
const services = serviceFactory();
services.data.forEach((s) => {
    s.uriMap.forEach((u) => {
        logger.info(`Registering '${s.name}' path '${u.baseUri}' at '${services.meta.apiPrefix}${u.baseUri}'`)
        app.use(`${services.meta.apiPrefix}${u.baseUri}`, proxy(u.serviceUri, {
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
})

// catchall for 404 handling
app.all('*', (req, res) => {
    res.status(404).json({ status: 404, message: 'Not Found' })
})

const httpServer = httpServerFactory(app)

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
             agent: new httpAgent({ rejectUnauthorized: false })
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
