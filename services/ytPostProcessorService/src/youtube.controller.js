import { Router } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'

const youtubeRouter = new Router()

// get jobs
youtubeRouter.get('/', (req, res) => {
    return res.status(StatusCodes.NOT_IMPLEMENTED).json({ status: StatusCodes.NOT_IMPLEMENTED, message: ReasonPhrases.NOT_IMPLEMENTED })
})

// submit job
youtubeRouter.post('/', (req, res) => {
    return res.status(StatusCodes.NOT_IMPLEMENTED).json({ status: StatusCodes.NOT_IMPLEMENTED, message: ReasonPhrases.NOT_IMPLEMENTED })
})

// get job status
youtubeRouter.get('/:id', (req, res) => {
    return res.status(StatusCodes.NOT_IMPLEMENTED).json({ status: StatusCodes.NOT_IMPLEMENTED, message: ReasonPhrases.NOT_IMPLEMENTED })
})

// delete job
youtubeRouter.delete('/:id', (req, res) => {
    return res.status(StatusCodes.NOT_IMPLEMENTED).json({ status: StatusCodes.NOT_IMPLEMENTED, message: ReasonPhrases.NOT_IMPLEMENTED })
})

export default youtubeRouter