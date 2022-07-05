const express = require('express')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { getPlatforms, getGames } = require('../controllers/igdb')

const igdbRouter = express.Router();

igdbRouter.get('/platforms', async (req, res) => {
    try {
        const platforms = await getPlatforms(req.query.filter || null, req.query.limit || 100, req.query.offset || null)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, platforms: platforms }).end()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    }
})

igdbRouter.get('/games', async (req, res) => {
    try {
        const games = await getGames(req.query.filter || null, req.query.limit || 100, req.query.offset || null)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, games: games }).end()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    }
})

module.exports = igdbRouter