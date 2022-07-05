const { logger } = require("../lib/logger")
const { IncentiveList } = require("../lib/db/models/incentiveList")
const { IncentiveAction } = require("../lib/db/models/incentive_actions")
const io = require('../lib/socketio')

async function getIncentives(active) {
    try {
        const filter = {}
        if(active) {
            filter.active = true
        }
        const incentives = await IncentiveList.find(filter).populate('actions')
        return incentives
    } catch (err) {
        logger.error('From getIncentives():')
        logger.error(err.message);
        logger.debug(err.stack);
        throw new Error('Cannot fetch incentives', { cause: err })
    }

}

async function getIncentive(id) {
    try {
        const incentive = await IncentiveList.findById(id).populate('actions')
        return incentive
    } catch (err) {
        logger.error('From getIncentive():')
        logger.error(err.message)
        logger.debug(err.stack)
        throw new Error('Cannot fetch incentive', { cause: err })
    }
}

async function addIncentive(payload) {
    try {
        const newIncentive = new IncentiveList({
            description: payload.description,
            // I might be trying to get too clever for my own good here...
            actions: (await IncentiveAction.insertMany(payload.actions)).map((action) => action._id),
            active: true
        })
        await newIncentive.save()

        io.sockets.emit('incentivelist:updated')
        return newIncentive
    } catch (err) {
        logger.error('From addIncentive():')
        logger.error(err.message)
        logger.debug(err.stack)
        throw new Error('Incentive not added', { cause: err })
    }
}

async function processIncentiveAction(id) {
    try {
        const incentive = await IncentiveList.findById(id).populate('actions')
        io.sockets.emit('incentive:trigger', incentive.actions)

        return incentive

    } catch (err) {
        logger.error('From processIncentiveAction():')
        logger.error(err.message)
        logger.debug(err.stack)
        throw new Error('Incentive not processed', { cause: err })
    }
}

async function updateIncentive(id, payload) {
    try {
        // grab record that needs to be updated
        const incentive = await IncentiveList.findById(id)
        if(incentive.description) incentive.description = payload.description
        // this next section is ugly as hell but probably
        // the best way to handle these updates without
        // missing anything or putting any unnecessary burden
        // on the app...

        // purge and re-add actions
        if(incentive.actions) {
            await IncentiveAction.deleteMany({ _id: { $in: incentive.actions.map((a) => a._id )}})
            incentive.actions = (await IncentiveAction.insertMany(payload.actions)).map((action) => action._id)
        }

        if(incentive.active) incentive.active = payload.active

        await incentive.save()

        io.sockets.emit('incentivelist:updated')
        return incentive
    } catch (err) {
        logger.error('From updateIncentive():')
        logger.error(err.message)
        logger.debug(err.stack)
        throw new Error('Incentive not updated', { cause: err })
    }
}

async function deleteIncentive(id) {
    try {
        const incentive = await IncentiveList.findById(id)
        await IncentiveAction.deleteMany({ _id: { $in: incentive.actions.map((a) => a._id )}})
        await IncentiveList.findOneAndDelete({ _id: id })

        io.sockets.emit('incentivelist:updated')
        return incentive
    } catch (err) {
        logger.error('From deleteIncentive():')
        logger.error(err.message);
        logger.debug(err.stack);
        throw new Error('Incentive not deleted', { cause: err })
    }
}

module.exports = {
    getIncentives,
    getIncentive,
    processIncentiveAction,
    addIncentive,
    updateIncentive,
    deleteIncentive
}