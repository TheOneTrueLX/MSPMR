import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { Server } from 'socket.io'
import fs from 'fs'
import * as url from 'url'

import { sessionMiddlewareFactory, socketIoSessionMiddlewareFactory } from '../../common/session.js'
import { logger, httpLoggerMiddlewareFactory } from '../../common/logger.js'
import httpServerFactory from '../../common/http.js'

export const socketAuthMiddleware = async (socket, next) => {
    if(socket.request.session && socket.request.session.user) {
        // we should already have access to the user id to create the room
        socket.join(socket.request.session.user.id);
        l.info(`Socket ${socket.id} joined room #${socket.request.session.user.id} from session data`)
        next()
    } else if(socket.handshake.auth) {
        // look up the user id by 
        const socket_auth = socket.handshake.auth;
        const user = await db('users').select('id').where('overlay_api_key', socket_auth.token);
        socket.join(user[0].id);
        l.info(`Socket ${socket.id} joined room #${user[0].id} from socket auth token`)
        next()
    } else {
        l.error(`Failed to create room for socket ${socket.id}: unauthorized`);
        socket.disconnect();
    }
}

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
app.get('/', (req, res, next) => {
    res.status(StatusCodes.NOT_IMPLEMENTED).json({ status: StatusCodes.NOT_IMPLEMENTED, message: ReasonPhrases.NOT_IMPLEMENTED })
})

const httpServer = httpServerFactory(app)
const io = new Server(httpServer, {
    cookie: {
        domain: config.host,
    }
})

socketIoSessionMiddlewareFactory(io)

io.on('connection', (socket) => {
    // do socket IO stuff here
    logger.debug(`Socket.IO connection ${socket.id} established`)

    socket.on('echo:send', (data) => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})] got event echo:send from with payload ${JSON.stringify(data)}`)
        socket.to(socket.request.session.user.id).emit('echo-response', data)
    })

    socket.on('video:play', () => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})] got socket.io event 'video:play'`)
        socket.in(socket.request.session.user.id).emit('overlay:play')
    })

    socket.on('video:pause', () => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})] got socket.io event 'video:pause'`)
        socket.in(socket.request.session.user.id).emit('overlay:pause')
    })

    socket.on('video:stop', () => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})] got socket.io event 'video:stop'`)
        socket.in(socket.request.session.user.id).emit('overlay:stop')
    })

    socket.on('video:startover', () => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})] got socket.io event 'video:startover'`)
        socket.in(socket.request.session.user.id).emit('overlay:startover')
    })

    socket.on('video:rewind', () => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})] got socket.io event 'video:rewind'`)
        socket.in(socket.request.session.user.id).emit('overlay:rewind')
    })

    socket.on('video:fastforward', () => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})] got socket.io event 'video:fastforward'`)
        socket.in(socket.request.session.user.id).emit('overlay:fastforward')
    })

    socket.on('queue:reorder', () => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})] got socket.io event 'queue:reorder'`)
        socket.in(socket.request.session.user.id).emit('overlay:reload')
    })

})

io.on('error', (err) => {
    logger.error(err.message)
    logger.debug(err.stack)
})

app.post('/:event', (req, res) => {
    // the other microservices can make this API call to
    // dispatch a socket.io event to the client
    io.in(req.session.user.id).emit(req.params.event, req.body.json)
})

httpServer.listen(config.port, config.host, () => {
    logger.info(`Server is listening at https://${config.host}:${config.port}`)
})
