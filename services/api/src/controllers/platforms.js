const { logger } = require('../lib/logger')
const { Platform } = require('../lib/db/models/platform')
const { GameList } = require('../lib/db/models/gameList')
const { rebuildWorkingList } = require('./working-games')
const io = require('../lib/socketio')

async function getPlatforms() {
    try {
        const platforms = await Platform.find({})
        return platforms
    } catch (err) {
        logger.error(err.message);
        logger.debug(err.stack);
        throw new Error('Unable to get Platforms', { cause: err })
    }
}

async function getPlatform(id) {
    try {
        const platform = await Platform.findById(id)
        return platform
    } catch (err) {
        logger.error(err.message);
        logger.debug(err.stack);
        throw new Error('Unable to get Platform', { cause: err })
    }
}

async function addPlatform(payload) {
    try {
        const platform = new Platform(payload)
        await platform.save()
        io.sockets.emit('platforms:updated')
        return platform
    } catch (err) {
        logger.error(err.message)
        logger.debug(err.stack)
        throw new Error('Unable to add platform', { cause: err })
    }
}

async function updatePlatform(id, payload) {
    try {
        const platform = await Platform.findOneAndUpdate({ _id: id }, payload, { returnDocument: 'after' })
        return platform
    } catch (err) {
        logger.error(err.message)
        logger.debug(err.stack)
        throw new Error('Unable to update platform', { cause: err })
    }
}

async function deletePlatform(id) {
    try {
        const platform = await Platform.findOne({_id: id})
        await GameList.deleteMany({ platform: platform._id })
        await Platform.findOneAndDelete({ _id: id })
        await rebuildWorkingList()
        return platform
    } catch (err) {
        logger.error(err.message)
        logger.debug(err.stack)
        throw new Error('Unable to delete platform', { cause: err })
    }
}

module.exports = {
    getPlatforms,
    getPlatform,
    addPlatform,
    updatePlatform,
    deletePlatform
}