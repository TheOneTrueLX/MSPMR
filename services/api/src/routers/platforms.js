const express = require('express')
const { Types } = require('mongoose')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { getPlatforms, getPlatform, addPlatform, updatePlatform, deletePlatform } = require('../controllers/platforms')

const platformsRouter = express.Router()

platformsRouter.get('/', async (req, res) => {
    try {
        const platforms = await getPlatforms()
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, platforms: platforms }).end()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
    }
})

platformsRouter.get('/:id', async (req, res) => {
    try {
        const platform = await getPlatform(new Types.ObjectId(req.params.id))
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, platform: platform }).end()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
    }
})

platformsRouter.post('/', async (req, res) => {
    try {
        const platform = await addPlatform(req.body)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, platform: platform }).end()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
    }
})

platformsRouter.patch('/:id', async (req, res) => {
    try {
        const platform = await updatePlatform(req.params.id, req.body)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, platform: platform }).end()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
    }
})

platformsRouter.delete('/:id', async (req, res) => {
    try {
        const platform = deletePlatform(req.params.id)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, platform: platform }).end()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
    }
})

module.exports = platformsRouter