import { Router } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'

import { getAllUserVideos, addVideoToUserQueue, deleteVideo, getVideosByUserId, getCurrentVideoFromQueue, promoteVideo, demoteVideo } from './video.lib'
import { requireAuthentication } from '../../common/middleware/routeguard.js'
import { logger } from '../../common/logger.js'

const videoRouter = new Router()

// get all videos for the current user
videoRouter.get('/', requireAuthentication, (req, res) => {
    getAllUserVideos(req.session.user).then((videos) => {
        return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, data: videos })
    }).catch((err) => {
        logger.error(err)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    })
})

// add a new video to the current user's channel
videoRouter.post('/', requireAuthentication, (req, res) => {
    addVideoToUserQueue(req.session.user, req.body).then((response) => {
        // If this doesn't return true, something horribly wrong has happened
        if(response) {
            return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK })
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: ReasonPhrases.BAD_REQUEST })
        }
    }).catch((err) => {
        logger.error(err)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    })
})

// delete a video from the current user's channel
videoRouter.delete('/:id', requireAuthentication, (req, res) => {
    deleteVideo(req.session.user, req.params.id).then((response) => {
        if(response) {
            return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK })
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({ status: StatusCodes.BAD_REQUEST, message: ReasonPhrases.BAD_REQUEST })
        }
    }).catch((err) => {
        logger.error(err)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    })
})

// get all videos for a specific user's channel by username
videoRouter.get('/:username', (req, res) => {
    getVideosByUserId(req.params.username).then((videos) => {
        if(videos && videos.length > 0) {
            return res.status(StatusCodes.OK).json({
                status: StatusCodes.OK,
                message: ReasonPhrases.OK,
                meta: {
                    username: req.params.username,
                },
                data: videos
            })
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ status: StatusCodes.NOT_FOUND, message: ReasonPhrases.NOT_FOUND })
        }
    }).catch((err) => {
        logger.error(err)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    })
})

// get all videos associated with a specific user by overlay
// API key without authentication - for public queue pages
videoRouter.get('/current/:apikey', (req, res) => {
    getCurrentVideoFromQueue(req.params.apikey).then((video) => {
        if(video) {
            return req.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, data: video })
        } else {
            return req.status(StatusCodes.NOT_FOUND).json({ status: StatusCodes.NOT_FOUND, message: ReasonPhrases.NOT_FOUND })
        }
    }).catch((err) => {
        logger.error(err)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    })
})

// move a video up in a user's queue
videoRouter.get('/promote/:video_id', requireAuthentication, (req, res) => {
    promoteVideo(req.params.video_id).then((videos) => {
        return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, data: videos })
    }).catch((err) => {
        logger.error(err)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    })
})

// move a video down in a user's queue
videoRouter.get('/demote/:video_id', requireAuthentication, (req, res) => {
    demoteVideo(req.session.user, req.params.video_id).then((videos) => {
        return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK, data: videos })
    }).catch((err) => {
        logger.error(err)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    })
})

export default videoRouter