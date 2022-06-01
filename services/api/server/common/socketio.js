import db from '../db';
import corsOptions from './cors';
import l from './logger';

export const socketOptions = {
    cookie: {
        domain: 'localhost',
    },
    cors: corsOptions
}

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

export const socketConnectionHandler = (socket) => {
    l.info(`Socket.IO connection ${socket.id} established`)

    socket.on('echo:send', (data) => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})] got event echo:send from with payload ${JSON.stringify(data)}`)
        socket.to(socket.request.session.user.id).emit('echo-response', data)
    })

    socket.on('video:playpause', () => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})] got socket.io event 'video:playpause'`)
    })

    socket.on('video:startover', () => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})] got socket.io event 'video:startover'`)
    })

    socket.on('video:rewind', () => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})] got socket.io event 'video:rewind'`)
    })

    socket.on('video:fastforward', () => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})] got socket.io event 'video:fastforward'`)
    })

    socket.on('video:remove', () => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})] got socket.io event 'video:remove'`)
    })  
}

export const socketErrorHandler = (err) => {
    l.error(`Socket.IO error: ${err}`)
    l.debug(err.stack)
}

export const socketMiddlewareWrapper = middleware => (socket, next) => middleware(socket.request, {}, next);
