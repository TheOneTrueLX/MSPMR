const express = require('express')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { spinWheel, resetWheel, incrementCounter, decrementCounter, resetCounter, startTimer, stopTimer, incrementTimer, resetTimer, sopSmash, sopPass } = require('../controllers/streamdeck')

const streamdeckRouter = express.Router();

streamdeckRouter.get('/wheel/spin', (req, res) => {
    if(spinWheel(req.query.exclude)) {
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK }).end()
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR})
    }
})

streamdeckRouter.get('/wheel/reset', (req, res) => {
    if(resetWheel()) {
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK }).end()
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR})
    }
})

streamdeckRouter.get('/counter/increment', (req, res) => {
    if(incrementCounter()) {
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK }).end()
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR})
    }
})

streamdeckRouter.get('/counter/decrement', (req, res) => {
    if(decrementCounter()) {
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK }).end()
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR})
    }
})

streamdeckRouter.get('/counter/reset', (req, res) => {
    if(resetCounter()) {
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK }).end()
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR})
    }
})

streamdeckRouter.get('/timer/start', (req, res) => {
    if(startTimer()) {
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK }).end()
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR})
    }
})

streamdeckRouter.get('/timer/stop', (req, res) => {
    if(stopTimer()) {
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK }).end()
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR})
    }
})

streamdeckRouter.get('/timer/increment', (req, res) => {
    if(incrementTimer()) {
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK }).end()
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR})
    }
})

streamdeckRouter.get('/timer/reset', (req, res) => {
    if(resetTimer()) {
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK }).end()
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR})
    }
})

streamdeckRouter.get('/sop/smash', (req, res) => {
    if(sopSmash()) {
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK }).end()
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR})
    }
})

streamdeckRouter.get('/sop/pass', (req, res) => {
    if(sopPass()) {
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK }).end()
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR})
    }
})


module.exports = streamdeckRouter