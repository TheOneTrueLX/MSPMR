const express = require('express')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { Types } = require('mongoose')
const { getIncentives, getIncentive, addIncentive, updateIncentive, deleteIncentive, processIncentiveAction } = require('../controllers/incentives')

const incentivesRouter = express.Router();

incentivesRouter.get('/', async (req, res) => {
    try { 
        const incentives = await getIncentives(req.query.active)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, incentives: incentives }).end()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
    }
 }) 

incentivesRouter.post('/', async (req, res) => {
    try {
        const incentive = await addIncentive(req.body)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, incentive: incentive }).end()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
    }
 }) 

incentivesRouter.get('/trigger/:id', async (req, res) => {
    try {
        const incentive = await processIncentiveAction(req.params.id)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, incentive: incentive }).end()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
    }
})

incentivesRouter.get('/:id', async (req, res) => {
    try {
        const incentive = await getIncentive(new Types.ObjectId(req.params.id))
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, incentive: incentive }).end()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
    }
}) 

incentivesRouter.patch('/:id', async (req, res) => {
    try {
        const incentive = await updateIncentive(new Types.ObjectId(req.params.id), req.body)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, incentive: incentive }).end()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
    }
}) 

incentivesRouter.delete('/:id', async (req, res) => {
    try {
        const incentive = deleteIncentive(new Types.ObjectId(req.params.id))
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, incentive: incentive }).end()
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
    }
}) 

module.exports = incentivesRouter