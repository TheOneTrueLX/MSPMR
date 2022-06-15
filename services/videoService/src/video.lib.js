import amqp from 'amqplib/callback_api'

import logger from '../../common/logger'
import db from '../../common/db'

async function isAuthorized(user_id, video_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db('users').where('id', user_id)
            const channel = await db('channels').where('owner_id', user_id)
            const video = await db('videos').where('id', video_id)
        } catch (err) {
            reject(Error('Could not query MSPMR database', { cause: err }))
        }
      
        var isAuthorized = false
        if(video[0].channels_id == channel[0].id) {
            // video is in the user's own channel
            isAuthorized = true
        }
      
        const moderator = await db('users_channels').where('users_id', user_id).andWhere('channels_id', video[0].channels_id)
        if(moderator.length > 0) {
            // video is in a channel that user moderates
            isAuthorized = true
        }

        resolve(isAuthorized)
    })
}

export function getAllUserVideos(user) {
    return new Promise(async (resolve, reject) => {
        try {
            const videos = await db('videos').where({
                channels_id: user.current_channel,
                status: 'processed'
            }).orderBy('sort_index')

            resolve(videos)
        } catch (err) {
            reject(Error('Unable to retrieve videos', { cause: err }))
        }
    })
}

export function addVideoToUserQueue(user, video) {
    return new Promise(async (resolve, reject) => {
        try {
            await db('videos').insert({
                channels_id: user.current_channel,
                submitter: video.submitter || user.username,
                service_type: 'youtube', // hard coded for now
                video_url: video.url,
                status: 'pending'
            })

            // The only reason we need to do this is to get the id 
            // from the newly-added video record in the DB
            const new_video = await db('videos').select(['id','video_url']).where({
                channels_id: user.current_channel,
                video_url: video.url,
                status: 'pending'
            }).orderBy('created_at', 'desc').limit(1)

            // TODO: Figure out how to add the video to the yt postprocessor queue
            // youtubeQueue.add({ id: video[0].id, channel_id: req.session.user.current_channel, url: video[0].video_url, user: req.session.user }, { attempts: 3, timeout: 60000 })
            amqp.connect(process.env.AMQP_SERVER_URI).then((err, conn) => {
                return conn.createChannel().then((channel) => {
                    var ok = channel.assertExchange('mspmr.direct', 'direct', { durable: true })
                    return ok.then(() => {
                        channel.publish('mspmr.direct', 'ytPostProcessorService', { video_id: new_video.id })
                        logger.debug(`[AMQP] dispatched to ytPostProcessorService: ${ video_id: new_video.id }`)
                        return channel.close()
                    })
                })
            }).finally(() => {
                conn.close()
            }).catch((err) => { 
                reject(Error('Unable to connect to event bus', { cause: err }))
            })

            // In the legacy API, nothing actually read the return value
            // of this function, so we'll just return true here
            resolve(true)

        } catch (err) {
            reject(Error('Unable to add video to queue', { cause: err }))
        }
    })
}

export function deleteVideo(user, id) {
    return new Promise(async (resolve, reject) => {    
        try {
            isAuthorized(user.id, id).then((response) => {
                if(response) {
                    // the user is authorized to delete this video
                    await db('videos').where('id', req.params.id).delete('id')
                    resolve(true)
                } else {
                    // the user is not authorized to delete this video
                    resolve(false)
                }
            }).catch((err) => {
                // an error occurred when attempting to determine
                // the authorization status of the user
                reject(err)
            })
        } catch (err) {
            // an error occurred when attempting to delete
            // the video from the queue
            reject(Error('Unable to delete video from queue', { cause: err }))
        }
    })
}

export function getVideosByUserId(username) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db('users').where('username', username)

            if(user) {
                const channels = await db('channels').where('owner_id', user[0].id)
                data = await db('videos').where({
                  channels_id: channels[0].id,
                  status: 'processed'
                }).orderBy('sort_index')

                resolve(data)
            } else {
                resolve(null)
            }
        } catch (err) {
            reject(Error('Could not fetch videos for user', { cause: err }))
        }
    })
}

export function getCurrentVideoFromQueue(api_key) {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db('users').where('overlay_api_key', apikey)
            if(user.length > 0) {
              const channel = await db('channels').select('id').where('owner_id', user[0].id)
              const video = await db('videos').where('channels_id', channel[0].id).orderBy('sort_index').limit(1)

              resolve(video[0])
            } else {
              resolve(null)
            }
        } catch (err) {
            reject(Error('Could not fetch video', { cause: err }))
        }
    })
}

export function promoteVideo(user, video_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const target_video = await db('videos').where('id', video_id)
            const channel_id = target_video[0].channels_id
            const prev_video = await db('videos')
                .where('channels_id', target_video[0].channels_id)
                .andWhere('sort_index', '<', target_video[0].sort_index)
                .andWhere('status', 'processed')
                .orderBy('sort_index', 'desc')
                .limit(1)
          
            if(prev_video.length > 0) {
                l.debug(`promoting record id# ${target_video[0].id}`)
                await db('videos').update('sort_index', prev_video[0].sort_index).where('id', target_video[0].id)
                await db('videos').update('sort_index', target_video[0].sort_index).where('id', prev_video[0].id)
            }
    
            const payload = await db('videos').where({
                channels_id: current_channel,
                status: 'processed'
            }).orderBy('sort_index')
    
            resolve(payload)
    
        } catch (e) {
            reject('Could not promote video in queue', { cause: err })
        }        

    })
}

export function demoteVideo(user, video_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const target_video = await db('videos').where('id', video_id)
            const channel_id = target_video[0].channels_id
            const prev_video = await db('videos')
                .where('channels_id', target_video[0].channels_id)
                .andWhere('sort_index', '>', target_video[0].sort_index)
                .andWhere('status', 'processed')
                .orderBy('sort_index', 'desc')
                .limit(1)
          
            if(prev_video.length > 0) {
                l.debug(`promoting record id# ${target_video[0].id}`)
                await db('videos').update('sort_index', prev_video[0].sort_index).where('id', target_video[0].id)
                await db('videos').update('sort_index', target_video[0].sort_index).where('id', prev_video[0].id)
            }
    
            const payload = await db('videos').where({
                channels_id: user.current_channel,
                status: 'processed'
            }).orderBy('sort_index')
    
            resolve(payload)
    
        } catch (e) {
            reject('Could not promote video in queue', { cause: err })
        }        

    })
}