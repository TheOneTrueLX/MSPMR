import { Router } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'

const authRouter = Router()

// returns JSON response with current user information
authRouter.get('/', (req, res) => {
    return res.status(StatusCodes.NOT_IMPLEMENTED).json({ status: StatusCodes.NOT_IMPLEMENTED, message: ReasonPhrases.NOT_IMPLEMENTED }).end()
})

// accepts callback from Twitch API and processes local
// user account information/auth tokens
authRouter.post('/callback', (req, res) => {
    return res.status(StatusCodes.NOT_IMPLEMENTED).json({ status: StatusCodes.NOT_IMPLEMENTED, message: ReasonPhrases.NOT_IMPLEMENTED }).end()
})

// destroys current user session
authRouter.get('/logout', (req, res) => {
    return res.status(StatusCodes.NOT_IMPLEMENTED).json({ status: StatusCodes.NOT_IMPLEMENTED, message: ReasonPhrases.NOT_IMPLEMENTED }).end()
})

export default authRouter