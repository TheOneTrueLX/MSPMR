import e, { Router } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import router from '../../../legacy-services/api/server/api/controllers/channels/router';

import { getUserChannels, setCurrentChannel } from './channel.lib'
import { requireAuthentication } from '../../common/middleware/routeguard'

channelRouter = new Router();

channelRouter.use(requireAuthentication)

channelRouter.get('/', (req, res) => {
    getUserChannels(req.session.user).then((channels) => {
        if(channels.length > 0) {
            return req.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, data: channels }) 
        } else {
            return req.status(StatusCodes.NOT_FOUND).json({ status: StatusCodes.NOT_FOUND, message: ReasonPhrases.NOT_FOUND })
        }
    }).catch((err) => {
        logger.error(err)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    })
})

channelRouter.get('/:channel_id', (req, res) => {
    // DON'T FORGET TO UPDATE req.session.user!
    setCurrentChannel(req.session.user, req.params.channel_id).then((user) => {
        // update session user
        req.session.user = user
        return req.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, data: user }) 
    }).catch((err) => {
        logger.error(err)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    })
})

export default channelRouter