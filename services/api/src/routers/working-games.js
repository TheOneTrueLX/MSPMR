const express = require('express')
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { logger } = require('../lib/logger');
const { getWorkingGame, getWorkingGames, updateWorkingGame, deleteWorkingGame, rebuildWorkingList, getCurrentSelectedGame, selectGame } = require('../controllers/working-games')

const workingRouter = express.Router();

workingRouter.get('/', async (req, res) => {
    try {
        const games = await getWorkingGames()
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, games: games })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err })
    }
})

workingRouter.get('/rebuild', async (req, res) => {
    try {
        logger.debug('trying from router')
        const games = await rebuildWorkingList()
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, games: games })        
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err })
    }
})

workingRouter.get('/current', async (req, res) => {
    try {
        const game = await getCurrentSelectedGame()
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, game: game })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err })
    }
})

workingRouter.get('/:id', async (req, res) => {
    try {
        const game = await getWorkingGame(req.params.id)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, game: game })       
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err })
    }
})

workingRouter.patch('/:id', async (req, res) => {
    try {
        const game = await updateWorkingGame(req.params.id, req.body)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, game: game })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err })
    }
})

workingRouter.delete('/:id', async (req, res) => {
    try { 
        const game = await deleteWorkingGame(req.params.id)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, game: game })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err })
    }
})

workingRouter.get('/:id/select', async (req, res) => {
    try {
        const game = await selectGame(req.params.id, req.query.exclude)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, game: game })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err })
    }
})

module.exports = workingRouter