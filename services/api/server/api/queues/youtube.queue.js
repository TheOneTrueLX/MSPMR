import Queue from 'bull';
import puppeteer from 'puppeteer';
import { io } from '../../common/server'
import { getCurrentVideoSortIndex } from '../services/videos.service';
import db from '../../db'
import l from '../../common/logger';

const youtubeQueue = new Queue('youtube-metadata-queue', 'redis://127.0.0.1:6379');

async function scrape(url) {
    // open up the video in a "browser"
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // simulate click of the "show more" link in the description
    const showMoreLink = await page.waitForSelector('tp-yt-paper-button.style-scope:nth-child(4)', {timeout: 5000});
    await showMoreLink.click();

    var title;
    try { 
        const titleElement = await page.waitForSelector('yt-formatted-string.ytd-video-primary-info-renderer:nth-child(1)', {timeout: 5000})
        title = await page.evaluate(el => el.innerText, titleElement)
    } catch (e) {
        title = 'not found'
    }

    var duration;
    try {
        const durationElement = await page.waitForSelector('.ytp-time-duration', {timeout: 5000})
        var duration_temp = await page.evaluate(el => el.innerText, durationElement)
        var a = duration_temp.split(':')
        if(a.length == 3) {
            duration = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[3]);
        } else {
            duration = (+a[0]) * 60 + (+a[1]);
        }
    } catch (e) {
        duration = 0
    }

    var result;
    try {
        const copyrightElement = await page.waitForSelector('ytd-metadata-row-header-renderer.style-scope:nth-child(1) > h4:nth-child(1) > yt-formatted-string:nth-child(1)', {timeout: 5000});
        const copyrightText = await page.evaluate(el => el.innerText, copyrightElement)

        if(copyrightText == 'Music in this video') {
            result = true;
        } else {
            result = false;
        }    
    } catch (e) {
        result = false;
    }
    
    await browser.close();
    const payload = {
        url: url,
        title: title,
        duration: duration,
        copyright: result
    }
    
    return payload;
}

youtubeQueue.process(async function (job, done) {
    // job description:
    // id = corresponds w/ channel ID in db
    // redeem_id = corresponds with the channel point redeem ID from Twitch
    //             (if this is null, we assume the video was manually
    //              submitted through the web front-end)
    // url = youtube video URL

    try {
        job.progress(5)
        const result = await scrape(job.data.url);
        job.progress(70)
        if(result.title && result.duration) {
            const sort_index = await getCurrentVideoSortIndex(job.data.channel_id)
            await db('videos').update({
                title: result.title,
                duration: result.duration,
                copyright: result.copyright,
                redeem_id: job.data.redeem_id || null,
                sort_index: sort_index,
                status: 'processed'
            }).where({ id: job.data.id })
        } else {
            job.moveToFailed()
        }
        job.progress(100)
        done(null, 'success')
    } catch (e) {
        done(e)
    }

})

youtubeQueue.on('active', (job, jobPromise) => {
    l.info(`[youtubeQueue] job ${job.id} has started`)
})

youtubeQueue.on('progress', (job, progress) => {
    l.info(`[youtubeQueue] job ${job.id} is ${progress}% complete`)
})

youtubeQueue.on('completed', (job, result) => {
    l.info(`[youtubeQueue] job ${job.id} has completed with the result ${result}`)
    io.in(job.data.user.id).emit('queue:reload')
})

youtubeQueue.on('failed', async (job) => {
    l.error(`[youtubeQueue] job ${job.id} has failed: ${job.failedReason}`)
    if(job.attemptsMade >= job.opts.attempts) {
        const video = await db('videos').where('id', job.data.id)
        if(video[0].redeem_id) {
            // TODO: refunding channel points would happen here
        }
        // last step: remove unprocessed record from videos table
        await db('videos').delete().where('id', job.data.id)
    }
})

youtubeQueue.on('stalled', (job) => {
    l.warn(`[youtubeQueue] job ${job.id} has stalled`)
})

youtubeQueue.on('drained', () => {
    l.info('[youtubeQueue] no more jobs left in the queue')
})

export default youtubeQueue;