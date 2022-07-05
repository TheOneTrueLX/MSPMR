const express = require('express')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { getSpinLog } = require('../controllers/spinlog')

const spinlogRouter = express.Router();

spinlogRouter.get('/', async (req, res) => {
    try {
        const spinlog = await getSpinLog(req.query.limit)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, spinlog: spinlog }).end()
    } catch(err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err })
    }
})

module.exports = spinlogRouter