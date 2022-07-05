const { Platform } = require('./db/models/platform')
const logger = require('./logger')

async function getEnabledPlatforms() {
    return new Promise((resolve, reject) => {
        Platform.find({ active: true}, (err, results) => {
            if(err) {
                logger.error(err.message);
                logger.debug(err.stack);
                reject(Error('Cannot get platforms', { cause: err }));
            }
            var platforms = [];
            results.forEach((item) => {
                platforms.push(item.igdb_id);
            })
            resolve(platforms);
        });
    });
}

module.exports = {
    getEnabledPlatforms
}