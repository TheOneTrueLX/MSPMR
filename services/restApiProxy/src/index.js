import 'dotenv/config'
import express from 'express'
import proxy from 'express-http-proxy'
import fetch from 'node-fetch'
import { createTerminus } from '@godaddy/terminus'
import { Agent as httpAgent } from 'https'
import fs from 'fs'
import * as url from 'url'

import httpServerFactory from '../../common/http.js'
import { sessionMiddlewareFactory } from '../../common/session.js'
import corsMiddlewareFactory from '../../common/cors.js'
import { logger, httpLoggerMiddlewareFactory } from '../../common/logger.js'

import serviceFactory from './lib/services.js'
import e from 'express'

const config = JSON.parse(fs.readFileSync(url.fileURLToPath(new URL('.', import.meta.url)) + '/config.json'))[process.env.NODE_ENV]

const app = express();

sessionMiddlewareFactory(app)
corsMiddlewareFactory(app, `https://${config.port}:${config.port}`)
httpLoggerMiddlewareFactory(app, config.logPath)

// default route
app.get('/internal/version', (req, res) => {
    res.json({ 'service': `${config.serviceName}`, version: `${config.serviceVersion}` }).end()
})

// microservice routes will go here
const services = serviceFactory();
services.data.forEach((s) => {
    s.uriMap.forEach((u) => {
        logger.info(`Registering '${s.name}' path '${u.baseUri}' at '${!(u.ignoreBaseUri && u.ignoreBaseUri === true) ? services.meta.apiPrefix : ''}${u.baseUri}'${!(u.ignoreBaseUri && u.ignoreBaseUri === true) ? '' : ' [API Prefix ignored per config]'}`)
        app.use(`${!(u.ignoreBaseUri && u.ignoreBaseUri === true) ? services.meta.apiPrefix : ''}${u.baseUri}`, proxy(u.serviceUri, {
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
    status.push(fetch(`https://${config.host}:${config.port}/internal/version`, { agent: new httpAgent({ rejectUnauthorized: false }) }).then((r) => { return r.json() }))
    services.data.forEach((s) => {
        s.uriMap.forEach((u) => {
            const regexp = /https\:\/\/.*\:[0-9]{4}\/.*/
            if(!regexp.test(u.serviceUri)) {
                status.push(fetch(`${u.serviceUri}/internal/version`, { agent: new httpAgent({ rejectUnauthorized: false }) })
                    .then((r) => { 
                        if(!r.ok) {
                            return { serviceUri: u.serviceUri, status: r.status, message: r.statusText }
                        } else {
                            return r.json() 
                        }
                    }).catch((e) => { 
                        return { serviceUri: u.serviceUri, }
                    })
                )
            }
        })
    })
    return Promise.all(status)
}

createTerminus(httpServer, {
    healthChecks: {
        '/': healthCheck,
        verbatim: true,
    }, 
    statusOk: 200,
    statusError: 503,
    timeout: 5000,
    onSignal: onSignal,
    onShutdown: onShutdown,
    logger: console.log
})

httpServer.listen(config.port, config.host, () => {
    logger.info(`Server is listening at https://${config.host}:${config.port}`)
})
