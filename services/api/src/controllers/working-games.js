const io = require('../lib/socketio')
const { GameList } = require('../lib/db/models/gameList')
const { SpinLog } = require('../lib/db/models/spinLog')
const { logger } = require('../lib/logger')
const { WorkingList } = require('../lib/db/models/workingList')
const { getEnabledPlatforms } = require('../lib/helpers')

async function getWorkingGames() {
    try {
        const enabled_platforms = await getEnabledPlatforms()
        const games = await WorkingList.find({}).populate({ path: 'game', populate: { path: 'platform', match: { platform: { _id: { $in: enabled_platforms }}}}})
        return games
    } catch (err) {
        logger.error(err.message);
        logger.debug(err.stack);
        throw new Error('Couldn\'t get Working Game List', { cause: err })
    }
}

async function getWorkingGame(id) {
    try {
        const enabled_platforms = await getEnabledPlatforms()
        const game = WorkingList.findById(id).populate({ path: 'game', populate: { path: 'platform', match: { platform: { _id: { $in: enabled_platforms }}}}})
        return game
    } catch (err) {
        logger.error(err.message);
        logger.debug(err.stack);
        throw new Error('Can\'t get Working Game', { cause: err })
    }
}

async function updateWorkingGame(id, payload) {
    try {
        const game = await WorkingList.findOneAndUpdate({ _id: id }, payload, { returnDocument: 'after' }).populate({ path: 'game', populate: { path: 'platform', model: 'Platform' }})
        return game
    } catch (err) {
        logger.error(err.message);
        logger.debug(err.stack);
        throw new Error('Can\'t update Working Game', { cause: err })
    }
}

async function deleteWorkingGame(id) {
    try {
        const game = await WorkingList.findOneAndDelete({ _id: id })
        return game
    } catch (err) {
        logger.error(err.message);
        logger.debug(err.stack);
        throw Error('Can\'t delete Working Game', { cause: err })
    }
}

async function rebuildWorkingList() {
    try {
        await WorkingList.deleteMany({})

        const enabled_platforms = await getEnabledPlatforms()
        if(enabled_platforms.length <= 0) {
            throw new Error('No platforms enabled')
        }

        const games = await GameList.aggregate([
            { $match: {
                    exclude_from_working_list: false
                }
            },
            { $sample: {
                    size: 30
                }
            },
            { $lookup: {
                    from: 'platforms',
                    localField: 'platform',
                    foreignField: '_id',
                    as: 'platform',
                    pipeline: [{ $match: { 'igdb_id': { $in: enabled_platforms } } }]
                }
            }
        ])

        var payload = []
        games.forEach((game) => {
           payload.push({ selected: false, game: game._id })
        })

        const workinglist = await WorkingList.create(payload)
        io.sockets.emit('workinglist:updated')
        return workinglist
    } catch (err) {
        logger.error(err.message)
        logger.debug(err.stack)
        throw new Error('Unable to build Working List', { cause: err })
    }
}

async function selectGame(id, exclude = false) {
    try {
        const lastgame = await WorkingList.findOneAndDelete({ selected: true })

        const selectedGame = await WorkingList.findOneAndUpdate({ _id: id }, { selected: true }, { returnDocument: 'after' }).populate({ path: 'game', populate: { path: 'platform', model: 'Platform' }})
        await GameList.findOneAndUpdate({ _id: selectedGame.game._id }, { selection_count: (selectedGame.game.selection_count + 1) })
        const game = await GameList.findOne({ _id: selectedGame.game._id}).populate('platform').lean()
        logger.debug(game)
        await SpinLog.create({ game: game })

        if(lastgame) { 
            if(exclude) {
                await GameList.findOneAndUpdate({ _id: lastgame._id }, { exclude_from_working_list: true })
            }

            const enabled_platforms = await getEnabledPlatforms();
            const newgame = await GameList.aggregate([
                { $match: {
                        exclude_from_working_list: false
                    }
                },
                { $sample: {
                        size: 1
                    }
                },
                { $lookup: {
                        from: 'platforms',
                        localField: 'platform',
                        foreignField: '_id',
                        as: 'platform',
                        pipeline: [{ $match: { 'igdb_id': { $in: enabled_platforms } } }]
                    }
                }
            ])
            await WorkingList.create({ selected: false, game: newgame[0]._id })
        }

        io.sockets.emit('spinlog:updated')
        io.sockets.emit('workinglist:updated')
        return selectedGame
    } catch (err) {
        logger.error(err.message)
        logger.debug(err.stack)
        throw new Error('Unable to select game for Working Game List', { cause: err })
    }
}

async function getCurrentSelectedGame() {
    try {
        const current = await WorkingList.findOne({ selected: true }).populate({ path: 'game', populate: { path: 'platform', model: 'Platform' }})
        if(current && current.game) {
            return current.game
        } else {
            return null
        }
    } catch (err) {
        logger.error(err.message)
        logger.debug(err.stack)
        throw new Error('Unable to get current Working Game', { cause: err })
    }
}

module.exports = {
    getWorkingGames,
    getWorkingGame,
    updateWorkingGame,
    deleteWorkingGame,
    rebuildWorkingList,
    selectGame,
    getCurrentSelectedGame
}