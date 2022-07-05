const { logger } = require("../lib/logger")
const io = require("../lib/socketio")

function spinWheel(exclude = false) {
    try {
        logger.debug('[socket.io] Sending \'wheel:spin\' signal to client')
        io.sockets.emit('wheel:spin', { exclude: exclude })
        return true;
    } catch (err) {
        return false;
    }
}

function resetWheel() { 
    try {
        logger.debug('[socket.io] Sending \'wheel:reset\' signal to client')
        io.sockets.emit('wheel:reset')
        return true;
    } catch (err) {
        return false;
    }
}

function incrementCounter() {
    try {
        logger.debug('[socket.io] Sending \'counter:increment\' signal to client')
        io.sockets.emit('counter:increment')
        return true;
    } catch (err) {
        return false;
    }
}

function decrementCounter() {
    try {
        logger.debug('[socket.io] Sending \'counter:decrement\' signal to client')
        io.sockets.emit('counter:decrement')
        return true;
    } catch (err) {
        return false;
    }
}

function resetCounter() {
    try {
        logger.debug('[socket.io] Sending \'counter:reset\' signal to client')
        io.sockets.emit('counter:reset')
        return true;
    } catch (err) {
        return false;
    }
}

function startTimer() {
    try {
        logger.debug('[socket.io] Sending \'timer:start\' signal to client')
        io.sockets.emit('timer:start')
        return true;
    } catch (err) {
        return false;
    }
}

function stopTimer() {
    try {
        logger.debug('[socket.io] Sending \'timer:stop\' signal to client')
        io.sockets.emit('timer:stop')
        return true;
    } catch (err) {
        return false;
    }
}

function incrementTimer() {
    try {
        logger.debug('[socket.io] Sending \'timer:increment\' signal to client')
        io.sockets.emit('timer:increment')
        return true;
    } catch (err) {
        return false;
    }
}

function resetTimer() {
    try {
        logger.debug('[socket.io] Sending \'timer:reset\' signal to client')
        io.sockets.emit('timer:reset')
        return true;
    } catch (err) {
        return false;
    }
}

function sopSmash() {
    try { 
        logger.debug('[socket.io] Sending \'sop:smash\' signal to client')
        io.sockets.emit('sop:smash')
        return true;
    } catch (err) {
        return false;
    }
}

function sopPass() {
    try { 
        logger.debug('[socket.io] Sending \'sop:pass\' signal to client')
        io.sockets.emit('sop:pass')
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = {
    spinWheel,
    resetWheel,
    incrementCounter,
    decrementCounter,
    resetCounter,
    startTimer,
    stopTimer,
    incrementTimer,
    resetTimer,
    sopSmash,
    sopPass,
}