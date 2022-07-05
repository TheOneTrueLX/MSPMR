const Bottleneck = require('bottleneck')
const axios = require('axios')

const { redisGetKey, redisSetKey } = require('../lib/redis.js')
const { logger } = require('../lib/logger.js')
const { getEnabledPlatforms } = require('../lib/helpers')

const limiter = new Bottleneck({
    minTime: 300,
    maxConcurrent: 1
});

async function getTwitchAccessToken() {
    var access_token = null;
    
    try {
        access_token = await redisGetKey('twitch_access_token')
    } catch (err) {
        logger.error('In function getTwitchAccessToken():')
        logger.error(err.message);
        logger.debug(err.stack);
        return null;
    }

    if(access_token) {
        return access_token;
    } else {
        try {
            const res = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`);
            access_token = res.data.access_token;
            await redisSetKey('twitch_access_token',access_token);
        } catch (err) {
            logger.error('In function getTwitchAccessToken():')
            logger.error(err.message);
            logger.debug(err.stack);
            await redisSetKey('twitch_access_token', null);
            return null;
        }
    }
    console.log(`access_token = ${access_token}`);
    return access_token;
}

async function getIgdbConfig() {
    const access_token = await getTwitchAccessToken()
    if(access_token) {
        const igdbConfig = {
            baseURL: 'https://api.igdb.com/v4',
            headers: {
                'Client-ID': process.env.TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${access_token}`
            }
        }
        return igdbConfig
    } else {
        throw new Error('Unable to generate IGDB Config')
    }
}

// these two functions are complete fucking necromancy

async function getPlatforms(filter, limit = 100, offset = null) {
    try {
        const igdbConfig = await getIgdbConfig()
        const platforms = await getEnabledPlatforms()
        const query = `fields *; where category = (1,5,6)${ platforms.length > 0 ? ` & id != (${platforms.join()}) ` : ''}${ filter ? ` & name ~ *"${filter}"*` : ''}; limit ${limit};${offset ? `; offset ${offset};` : ''} sort name asc;`
        const igdb_res = await limiter.schedule(() => axios.post('/platforms', query, igdbConfig))
        return igdb_res.data
    } catch(err) {
        logger.error(`In function getPlatforms(${filter}, ${limit}, ${offset}):`)
        logger.error(err.message);
        logger.debug(err.stack);
    }
}

async function getGames(filter, limit = 50, offset = null) {
    try {
        const igdbConfig = await getIgdbConfig();

        const platforms = await getEnabledPlatforms()
        if(!platforms) {
            // fail fast if no platforms are enabled
            return []
        }

        const query = `fields id,name,platforms.name,platforms.abbreviation,cover.image_id; where themes != (42) & platforms = (${platforms.join()}) ${ filter ? `& name ~ *"${filter}"*` : ''}; limit ${limit};${offset ? `; offset ${offset};` : ''} sort name asc;`
        const igdb_res = await limiter.schedule(() => axios.post('/games', query, igdbConfig))
        var retval = []
        igdb_res.data.forEach((game) => {
            game.platforms.forEach((platform) => {
                const payload = {
                    id: game.id,
                    name: game.name,
                    cover: game.cover,
                    platform: platform
                }
                if(platforms.includes(payload.platform.id)) {
                    retval.push(payload)
                }        
            })
        })
        return retval

    } catch (err) {
        logger.error(`In function getGames(${filter}, ${limit}, ${offset}):`)
        logger.error(err.message);
        logger.debug(err.stack);
        throw new Error('Error fetching games', { cause: err })
    }
}

module.exports = {
    getPlatforms,
    getGames
}