const { logger } = require('../lib/logger')
const { SpinLog } = require('../lib/db/models/spinLog')

async function getSpinLog(limit = null) {
    try {
        const spinlog = await SpinLog.find({})
            .sort({ spindate: -1 })
            .limit(limit ? limit : null)
        return spinlog
    } catch (err) {
        logger.error(err.message);
        logger.debug(err.stack);
        throw new Error('Couldn\'t get Spinlog', { cause: err })
    }
}

module.exports = {
    getSpinLog
}