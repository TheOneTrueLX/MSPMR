import { Server } from 'socket.io';
import sessionMiddleware from './session';
import corsOptions from './cors';
import l from './logger';

export const SIOConfig = {
    cookie: {
        domain: 'localhost',
    },
    cors: corsOptions
}

export function onSIOConnection(socket) {
    
    l.info(`Socket.IO connection ${socket.id} established`)
  
    socket.on('echo:send', (data) => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})] got event echo:send from with payload ${JSON.stringify(data)}`)
        socket.emit('echo-response', data)
    })

    socket.on('video:playpause', () => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})]  got socket.io event 'video:playpause'`)
    })

    socket.on('video:startover', () => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})]  got socket.io event 'video:startover'`)
    })

    socket.on('video:rewind', () => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})]  got socket.io event 'video:rewind'`)
    })

    socket.on('video:fastforward', () => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})]  got socket.io event 'video:fastforward'`)
    })

    socket.on('video:remove', () => {
        l.info(`[socket ID: ${socket.id}] [user: ${socket.request.session.user.username}(${socket.request.session.user.id})]  got socket.io event 'video:remove'`)
    })

}

export function onSIOError(err) {
    l.error(`Socket.IO error: ${err}`)
}
