const { Server } = require('socket.io')

const { corsOptions } = require('./cors.js')
const { logger } = require('./logger.js')

const socketOptions = {
    cors: corsOptions
}

const socketConnectionHandler = (socket) => {
    logger.info(`Socket.IO connection ${socket.id} established`)  
}

const socketErrorHandler = (err) => {
    logger.error(`Socket.IO error: ${err}`)
    logger.debug(err.stack)
}

const io = new Server(socketOptions)
io.on('connection', socketConnectionHandler)
io.on('error', socketErrorHandler)

module.exports = io