import { Router } from 'express'
import { google } from 'googleapis'
import moment from 'moment'

import db from '../../common/db'
import { logger } from '../../common/logger.js'
import youtubeQueue from './youtube.queue.js'

const youtube = google.youtube('v3')

function getYoutubeIdFromUrl(url) {
    var regexp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    var match = url.match(regexp)
    if (match && match[2].length == 11) {
        return match[2]
    } else {
        return null
    }
}

export function postProcessYoutubeVideo(video_id) {
    return new Promise(async (resolve, reject) => {
        try {
            const video = db('videos').where('id', video_id)
            if(video) {

                // Authenticate to Youtube Data API
                const authClient = google.auth.fromAPIKey(process.env.YT_API_KEY)
                google.options({ auth: authClient })
                
                // Query Youtube API for video metadata
                const payload = {
                    id: getYoutubeIdFromUrl(video.video_url),
                    part: 'snippet,contentDetails' 
                }
                if(!payload.id) {
                    // probably not a Youtube URL
                    resolve(false)
                }

                const yt_res = await youtube.videos.list(payload)

                // Update database
                await db('videos').update({
                    title: yt_res.data.snippet.title,
                    // moment was a monumental timesaver here since
                    // it understands ISO 8601 durations
                    duration: moment.duration(yt_res.data.contentDetails).seconds(),
                    age_restricted: yt_res.data.contentDetails.contentRating.ytRating === 'ytAgeRestricted' ? true : false,
                    status: 'processed'
                }).where('id', video_id)

                // Start job to attempt scraping copyright data from video
                // this needs to happen *LAST* becasue the record needs
                // to be updated in the database before the job runs
                youtubeQueue.add({ video_id: video_id }, { attempts: 3, timeout: 60000 })

                resolve(true)
            } else {
                // couldn't find the video.  This isn't strictly a failure
                // so we're not going to reject the promise here.  The caller
                // will need to know how to deal with the truthiness of 
                // this return value.
                resolve(false)
            }

        } catch (err) {
            logger.error(err)
            logger.debug(stack)
            reject(Error('Could not perform post-processing on Youtube Video', { cause: err }))
        }
    })
}