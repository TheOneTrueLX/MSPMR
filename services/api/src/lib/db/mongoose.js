// init db connection maybe?
const mongoose = require('mongoose')
const { logger } = require('../logger.js')

function mongoLogger(msg, state) {
    switch(state.type) {
        case 'debug':
            logger.debug(state)
            break;
        case 'error':
            logger.error(state)
            break;
        case 'warn':
            logger.warn(state)
            break;
        default:
            logger.info(state)
    }
}

const mongooseConfig = {
    logger: mongoLogger,
    loggerLevel: process.env.LOG_LEVELS
}

mongoose.connection.on('connecting', () => { 
    logger.info(`MongoDB connecting to ${process.env.MONGO_URI} [readystate = ${mongoose.connection.readyState}]`);
})

mongoose.connection.on('connected', () => {
    logger.info(`MongoDB connected to ${process.env.MONGO_URI} [readystate = ${mongoose.connection.readyState}]`);
})

mongoose.connection.on('disconnecting', () => {
    logger.warn(`MongoDB disconnecting from ${process.env.MONGO_URI} [readystate = ${mongoose.connection.readyState}]`);
})

mongoose.connection.on('disconnected', () => {
    logger.warn(`MongoDB disconnected from ${process.env.MONGO_URI} [readystate = ${mongoose.connection.readyState}]`);
})    

mongoose.set('debug', true);
mongoose.connect(process.env.MONGO_URI, mongooseConfig) 

module.exports = mongoose