const http = require('https')
const fs = require('fs')

const { logger } = require('./logger.js');

function httpServerFactory(app) {
    const httpOptions = {
        key: fs.readFileSync(process.env.TLS_KEY),
        cert: fs.readFileSync(process.env.TLS_CERT)
    };

    const httpServer = http.createServer(httpOptions, app);

    httpServer.on('clientError', (err, socket) => {
        if (err.code === 'ECONNRESET' || !socket.writable) {
            return;
        } else {
            logger.error(`${err.type}: ${err.message}`);
            logger.debug(err.stack);
        }
        socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    })
    
    return httpServer;
}

module.exports = httpServerFactory