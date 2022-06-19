import { Router } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import fetch from 'node-fetch'
import crypto from 'crypto'

import db from '../../common/db/index.js'
import { logger } from '../../common/logger.js'

import { getCurrentUser, twitchOauthCallback, validateBetaCode, validateEulaAcceptance } from './auth.lib.js'
import { requireAuthentication } from '../../common/middleware/routeguard.js'

const authRouter = Router()

const KNOWN_MODBOTS = [
    'nightbot',
    'moobot',
    'streamelements',
    'streamlabs',
    'sery_bot',
]

// returns JSON response with current user information
authRouter.get('/', requireAuthentication, (req, res) => {
    getCurrentUser(req.session.user).then((user) => {
        if(user) {
            return res.status(StatusCodes.OK).json(user)
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({ status: StatusCodes.UNAUTHORIZED, message: ReasonPhrases.UNAUTHORIZED })
        }
    }).catch((err) => {
        logger.error(err)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    })
})

// accepts callback from Twitch API and processes local
// user account information/auth tokens
authRouter.post('/callback', (req, res) => {
    twitchOauthCallback(req.body.code).then((user) => {
        // set the user session variable here
        req.session.user = user;
        return res.status(StatusCodes.CREATED).json(user)
    }).catch((err) => {
        logger.error(err)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    })
})

// validate beta code and authorize user for beta program
authRouter.patch('/beta', requireAuthentication, (req, res) => {
    validateBetaCode(req.session.user, req.body.key).then((valid_code) => {
        if(valid_code) {
            return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK })
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({ status: StatusCodes.UNAUTHORIZED, message: ReasonPhrases.UNAUTHORIZED })
        }
    }).catch((err) => {
        logger.error(err)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    })
})

// validate user's acceptance of EULA
authRouter.patch('/eula', requireAuthentication, (req, res) => {
    validateEulaAcceptance(req.session.user).then((is_accepted) => {
        if(valid_code) {
            return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK })
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({ status: StatusCodes.UNAUTHORIZED, message: ReasonPhrases.UNAUTHORIZED })
        }
    }).catch((err) => {
        logger.error(err)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    })    
})

// destroys current user session
authRouter.get('/logout', requireAuthentication, (req, res) => {
    try {
        if(req.session.user) {
            req.session.destroy()
            return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK })
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: ReasonPhrases.BAD_REQUEST })
        }
    } catch (err) {
        logger.error(err.message)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    }
})

export default authRouter