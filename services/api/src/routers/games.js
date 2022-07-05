const express = require('express')
const { Types } = require('mongoose')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { getGames, getSingleGame, addGame, updateGame, deleteGame, exportGames } = require('../controllers/games')

const gamesRouter = express.Router()

gamesRouter.get('/', async (req, res) => {
    try { 
        const games = await getGames(req.query.exclude || false, req.query.smash || false)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, games: games }).end()
    } catch(err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
    }
})

gamesRouter.get('/export', async (req, res) => {
    try {
        const games = await exportGames()
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, games: games }).end()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
    }
})

gamesRouter.get('/:id', async (req, res) => {
    try {
        const game = await getSingleGame(req.params.id)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, game: game }).end()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
    }
})

gamesRouter.post('/', async (req, res) => {
    try {
        const game = await addGame(req.body)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, data: game }).end()
    } catch(err) {
        if(err.message === 'Duplicate Game Record') {
            res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: ReasonPhrases.BAD_REQUEST, game: err }).end()
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
        }
    }
})

gamesRouter.patch('/:id', async (req, res) => {
    try {
        const game = await updateGame(new Types.ObjectId(req.params.id), req.body)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, data: game })
    } catch (err) {
        if(err.message === 'Game not found') {
            res.status(StatusCodes.NOT_FOUND).json({ status: StatusCodes.NOT_FOUND, message: ReasonPhrases.NOT_FOUND, game: err }).end()
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
        }
    }
})

gamesRouter.delete('/:id', async (req, res) => {
    try {
        const game = await deleteGame(new Types.ObjectId(req.params.id))
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, data: game })
    } catch (err) {
        if(err.message === 'Game not found') {
            res.status(StatusCodes.NOT_FOUND).json({ status: StatusCodes.NOT_FOUND, message: ReasonPhrases.NOT_FOUND, game: err }).end()
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
        }
    }
})

module.exports = gamesRouter