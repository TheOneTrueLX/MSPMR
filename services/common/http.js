import * as http from 'https'
import { logger } from './logger.js'
import fs from 'fs'

function httpServerFactory(app) {
    const httpOptions = {
        key: fs.readFileSync(process.env.TLS_KEY),
        cert: fs.readFileSync(process.env.TLS_CERT)
    }

    const httpServer = http.createServer(httpOptions, app)

    httpServer.on('clientError', (err, socket) => {
        if (err.code === 'ECONNRESET' || !socket.writable) {
            return
        } else {
            logger.error(`${err.type}: ${err.message}`)
            logger.debug(err.stack)   
        }
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
    })
    
    return httpServer
}

export default httpServerFactory