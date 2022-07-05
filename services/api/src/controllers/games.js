const { logger } = require('../lib/logger.js')
const { GameList } = require('../lib/db/models/gameList.js')
const { Platform } = require('../lib/db/models/platform.js')
const { rebuildWorkingList } = require('./working-games')
const { getEnabledPlatforms } = require('../lib/helpers')
const io = require('../lib/socketio')

async function getGames(exclude = false, smash = false) {
    try {

        const query_filter = {};
        if(exclude) {
            query_filter.exclude_from_working_list = false;
        }

        if(smash) {
            query_filter.$or = [
                { smashed: { $exists: false }},
                { smashed: false }
            ];
        }

        const enabled_platforms = await getEnabledPlatforms()
        const games = GameList.find(query_filter).populate({ path: 'platform', match: { platform: { _id: { $in: enabled_platforms }}}})
        return games
    } catch (err) {
        logger.error(err.message)
        logger.debug(err.stack)
        throw new Error('Database Error', { cause: err })
    }
}

async function getSingleGame(id) {
    try {
        const enabled_platforms = await getEnabledPlatforms()
        const game = await GameList.find({ _id: id }).populate({ path: 'platform', match: { platform: { _id: { $in: enabled_platforms }}}})
        return game
    } catch (err) {
        logger.error(err.message);
        logger.debug(err.stack);
        throw new Error('Database Error', { cause: err })
    }
}

async function addGame(payload) {
    try {
        const dupecheck = await (await GameList.find({ igdb_id: payload.igdb_id }).populate({ path: 'platform', match: { platform: { igdb_id: payload.platforms[0].igdb_id }}}))
        
        if(dupecheck.length > 0) {
            // fail fast if there's a duplicate
            return null;
        }

        let platform = await Platform.findOne({ igdb_id: payload.platforms[0].igdb_id })

        if(!platform) {
            const newPlatform = new Platform({
                name: payload.platforms[0].name,
                abbreviation: payload.platforms[0].abbreviation,
                igdb_id: payload.platforms[0].igdb_id,
                active: true
            })

            await newPlatform.save()
            platform = newPlatform
        }

        const newGame = new GameList({
            name: payload.name,
            platform: platform._id,
            submitter: payload.submitter,
            notes: payload.notes,
            exclude_from_working_list: payload.exclude_from_working_list,
            igdb_id: payload.igdb_id,
            igdb_cover_id: payload.igdb_cover_id,
            // sensible defaults
            selection_count: 0,
            weight: 50
        });

        await newGame.save()

        io.sockets.emit('gamelist:updated')
        return newGame

    } catch (err) {
        logger.error('From addGame(payload):')
        logger.error(err.message);
        logger.debug(err.stack);
        throw new Error('Unable to add new game', { cause: err })
    }
}

async function updateGame(id, payload) {
    try {
        const game = await GameList.findOneAndUpdate({ _id: id }, payload, { returnDocument: 'after' }) 
        if (!game) {
            throw new Error('Game not found')
        }
        io.sockets.emit('gamelist:updated')
        return game 
    } catch (err) {
        logger.error(err.message);
        logger.debug(err.stack);
        throw new Error('Database Error', { cause: err })
    }
}

async function deleteGame(id) {
    try {
        const game = GameList.findOneAndDelete({ _id: id })
        if(!game) {
            throw new Error('Game not found')
        }
        await rebuildWorkingList()
        io.sockets.emit('gamelist:updated')
        return game
    } catch (err) {
        logger.error(err.message);
        logger.debug(err.stack);
        throw new Error('Database Error', { cause: err })
    }
}

async function exportGames() {
    try {
        var result = []
        const games = await GameList.find({}).populate('platform')
        games.forEach((game) => {
            result.push({
                game_name: game.name,
                game_igdb_id: game.igdb_id,
                game_cover_id: game.igdb_cover_id,
                platform_name: game.platform.name,
                platform_igdb_id: game.platform.igdb_id,
                game_exclude: game.exclude_from_working_list,
                game_select_count: game.selection_count,
                game_weight: game.weight,
                game_notes: game.notes,
            })
        })
        return result
    } catch (err) {
        throw new Error('Error exporting Game List', { cause: err })
    }
}

async function importGames() {

}

module.exports = {
    getGames,
    getSingleGame,
    addGame,
    updateGame,
    deleteGame,
    exportGames,
    importGames
}