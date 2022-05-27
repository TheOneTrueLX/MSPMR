import { Server } from 'socket.io';
import l from './logger';

const io = new Server({
    allowEIO3: false
})

io.on('connection', (socket) => {
    l.info(`Socket.IO connection #${socket.id} established`)

    socket.on('echo-send', (data) => {
        l.info(`got event echo-send with payload ${JSON.stringify(data)}`)
        socket.emit('echo-response', data)
    })

    socket.on('video-playpause', () => {
        l.info(`Got socket.io event 'video-playpause'`)
    })

    socket.on('video-startover', () => {
        l.info(`Got socket.io event 'video-startover'`)
    })

    socket.on('video-rewind', () => {
        l.info(`Got socket.io event 'video-rewind'`)
    })

    socket.on('video-fastforward', () => {
        l.info(`Got socket.io event 'video-fastforward'`)
    })

    socket.on('video-remove', () => {
        l.info(`Got socket.io event 'video-remove'`)
    })

})

io.on('error', (err) => {
    l.error(`Socket.IO error: ${err}`)
})

export default io;