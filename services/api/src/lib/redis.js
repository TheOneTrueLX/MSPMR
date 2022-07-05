const { createClient } = require('redis')
const { logger } = require('./logger.js')

const client = createClient({ url: process.env.REDIS_URI })

client.on('connect', async () => {
    const clientInfo = await client.clientInfo()
    logger.info(`Connected to redis server at ${clientInfo.laddr}`)
})

client.on('error', (err) => {
    logger.error(err.message)
    logger.debug(err.stack)
})

client.connect().catch((err) => {
    logger.error(err.message)
    logger.debug(err.stack)
})

async function redisSetKey(key, value) {
    await client.set(key, value, {EX: 5400}).catch((err) => {
        logger.error(err.message)
        logger.debug(err.stack)
    })
}

async function redisGetKey(key) {
    const result = await client.get(key).catch((err) => {
        logger.error(err.message)
        logger.debug(err.stack)
    })
    return result
}

module.exports = {
    redisSetKey,
    redisGetKey,
}