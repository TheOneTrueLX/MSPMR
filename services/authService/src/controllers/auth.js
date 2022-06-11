import { Router } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import fetch from 'node-fetch'
import crypto from 'crypto'

import db from '../../../common/db'
import { logger } from '../../../common/logger.js'

const authRouter = Router()

const KNOWN_MODBOTS = [
    'nightbot',
    'moobot',
    'streamelements',
    'streamlabs',
    'sery_bot',
]

// returns JSON response with current user information
authRouter.get('/', async (req, res) => {

    try {
        if(req.session && req.session.user) {
            const user = await db('users').where('id', req.session.user)

            if(user.expires_at && user.expires_at <= Date.now()) {
                logger.debug(`Refreshing Twitch oauth token for ${user.username} (${user.id})`)
                payload = {
                    client_id: process.env.TWITCH_CLIENT_ID,
                    client_secret: process.env.TWITCH_CLIENT_SECRET,
                    grant_type: 'refresh_token',
                    refresh_token: user.refresh_token
                }

                const oauth2_res = fetch('https://id.twitch.tv/oauth2/token', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                    body: JSON.stringify(payload)
                })
                await db('users')
                .where('id', req.session.user.id)
                .update({
                    access_token: oauth2_res.access_token,
                    refresh_token: oauth2_res.refresh_token,
                    expires_in: new Date(new Date().getTime() + (14124 * 1000))
                })
            }

            const result = await db('users')
            .select('id','username','overlay_api_key','profile_image','current_channel','created_at','updated_at','beta_authorized','eula_accepted')
            .where('id', req.session.user.id);
            return res.status(StatusCodes.OK).json(result).end()
            
        } else {
            return res.status(StatusCodes.NOT_FOUND).json({ status: StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND })
        }
    } catch (err) {
        logger.error(err.message)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    }

})

// accepts callback from Twitch API and processes local
// user account information/auth tokens
authRouter.post('/callback', (req, res) => {
    const oauth2_payload = {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        code: req.body.code || 'undefined',
        grant_type: 'authorization_code',
        redirect_uri: process.env.FRONTEND_AUTH_REDIRECT
    }

    try {
        // complete the oauth2 authentication loop and get
        // auth tokens from the Twitch oauth2 API
        const oauth2_res = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify(oauth2_payload)
        })

        // get user(broadcaster) information from the Twitch Helix API
        const tapi_user_res = await fetch('https://api.twitch.tv/helix/users', {
            method: 'GET',
            credentials: 'include'
            headers: {
                'Authorization': `Bearer ${oauth2_res.data.access_token}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID
            }
        })

        const user = await db('users').where('id', tapi_user_res.data.data[0].id)
        if(user.length > 0) {
            // update existing user
            await db('users')
            .where('id', tapi_user_res.data.data[0].id)
            .update({
                username: tapi_user_res.data.data[0].display_name,
                profile_image: tapi_user_res.data.data[0].profile_image_url,
                // while we're here, let's do a sanity check to make sure 
                // the user has an overlay_api_key
                overlay_api_key: ((user.overlay_api_key == null || user.overlay_api_key = '') ?
                                 crypto.createHash('sha512').update(new Date()).digest('hex') :
                                 user.overlay_api_key),
                email: tapi_user_res.data.data[0].email,
                access_token: oauth2_res.data.access_token,
                refresh_token: oauth2_res.data.refresh_token,
                expires_at: new Date(new Date().getTime() + (oauth2_res.data.expires_in * 1000))
            });
        } else {
            // create new user
            await db('users').insert({
                id: tapi_user_res.data.data[0].id,
                username: tapi_user_res.data.data[0].display_name,
                profile_image: tapi_user_res.data.data[0].profile_image_url,
                overlay_api_key: crypto.createHash('sha512').update(new Date()).digest('hex'),
                email: tapi_user_res.data.data[0].email,
                access_token: oauth2_res.data.access_token,
                refresh_token: oauth2_res.data.refresh_token,
                expires_at: new Date(new Date().getTime() + (oauth2_res.data.expires_in * 1000))
            });            
        }

        // since knex returns an array of POJOs (good) in response to
        // queries, we don't have an elegant way of refreshing the user
        // object apart from what we're about to do...
        const user = await db('users')
        .select('id','username','overlay_api_key','profile_image','current_channel','created_at','updated_at','beta_authorized','eula_accepted')
        .where('id', tapi_user_res.data.data[0].id)

        // This is a good time to ensure that there's a channel record
        // associated with this user, and to make sure the user's current
        // channel field is set
        const channel = await db('channels').where('owner_id', user[0].id)
        if(channel.length === 0) {
            await db('channels').insert('owner_id', user[0].id)
        }
        // update just in case the channel was created
        const channel = await db('channels').where('owner_id', user[0].id)

        if(user[0].current_channel == null) {
            await db('users').update('current_channel', channel[0].id).where('id', user[0].id)
        }

        // one last update...
        const user = await db('users')
        .select('id','username','overlay_api_key','profile_image','current_channel','created_at','updated_at','beta_authorized','eula_accepted')
        .where('id', tapi_user_res.data.data[0].id)
        // the user object should be pristine now

        // now we need to get the list of mods for this user's channel
        const tapi_mods_res = await fetch(`https://api.twitch.tv/helix/moderation/moderators?broadcaster_id=${user[0].id}`, {
            headers: {
                'Authorization': `Bearer ${oauth2_res.data.access_token}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID
            }
        })

        tapi_mods_res.data.data.forEach(async (mod) => {
            const mod_check = await db('users').where('id', mod.user_id).count()
            if(mod_check[0]['count(*)'] === 0 && !(KNOWN_MODBOTS.includes(String(mod.user_name).toLowerCase()))) {
                await db('users').insert({ id: mod.user_id, username: mod.user_name })
            }
        })

        if(!(KNOWN_MODBOTS.includes(String(mod.user_name).toLowerCase()))) {
            await db('users_channels').insert({ users_id: mod.user_id, channels_id: Number(channel[0].id)})
        }

        // finally, update the session global and spit out the user in our response
        req.session.user = user[0]
        return res.status(StatusCodes.CREATED).json(user[0])

    } catch (err) {
        logger.error(err.message)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    }

})

// validate beta code and authorize user for beta program
authRouter.patch('/beta', async (req, res) => {
    try {
        const betaCode = await db('beta_codes')
        .where('users_id', req.session.user.id)
        .andWhere('beta_key', req.body.key)
        .andWhere('expires_at', '>=', Date.now())
        .orderBy('expires_at', 'desc')
        .limit(1)

        if(betaCode.length == 1) {
            await db('users').update('beta_authorized', true).where('id', req.session.user.id)
            return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK })
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({ status: StatusCodes.UNAUTHORIZED, message: ReasonPhrases.UNAUTHORIZED })
        }
    } catch (err) {
        logger.error(err.message)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    }
})

// validate user's acceptance of EULA
authRouter.patch('/eula', async (req, res) => {
    try {
        await db('users').update('eula_accepted', true).where('id', req.session.user.id)
        return res.status(StatusCodes.OK).json({ status: StatusCodes.OK, message: ReasonPhrases.OK })
    } catch (err) {
        logger.error(err.message)
        logger.debug(err.stack)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ status: StatusCodes.INTERNAL_SERVER_ERROR, message: ReasonPhrases.INTERNAL_SERVER_ERROR })
    }
})

// destroys current user session
authRouter.get('/logout', (req, res) => {
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