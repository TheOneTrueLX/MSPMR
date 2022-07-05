const express = require('express')
const { StatusCodes, ReasonPhrases } = require('http-status-codes')
const { getSubmissions, addSubmission, deleteSubmission } = require('../controllers/submissions')

const submissionRouter = express.Router()

submissionRouter.get('/', async (req, res) => {
    try { 
        const submissions = await getSubmissions()
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, submissions: submissions }).end()
    } catch(err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
    }
})

submissionRouter.get('/:submitter/:submission_text', async (req, res) => {
    try {
        const submission = await addSubmission(req.params.submitter, req.params.submission_text)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, submission: submission }).end()
    } catch(err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
    }
})

submissionRouter.delete('/:id', async (req, res) => {
    try {
        const submission = await deleteSubmission(req.params.id)
        res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, submission: submission })
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR, data: err }).end()
    }
})

module.exports = submissionRouter