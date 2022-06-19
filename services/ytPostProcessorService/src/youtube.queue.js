import Queue from 'bull';
import puppeteer from 'puppeteer';
import { getCurrentVideoSortIndex } from './util.js';
import db from '../../common/db/index.js'
import { logger } from '../../common/logger.js';

const youtubeQueue = new Queue('youtube-metadata-queue', 'redis://127.0.0.1:6379');

async function scrape(url) {
    // open up the video in a "browser"
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // simulate click of the "show more" link in the description
    const showMoreLink = await page.waitForSelector('tp-yt-paper-button.style-scope:nth-child(4)', {timeout: 5000});
    await showMoreLink.click();

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
        copyright: result
    }
    
    return payload;
}

youtubeQueue.process(async function (job, done) {
    try {
        const video = db('videos').where('id', job.data.video_id)
        job.progress(5)
        const result = await scrape(video.video_url);
        job.progress(70)
        await db('videos').update({
            copyright: result.copyright || null,
            status: 'processed'
        }).where('id', job.data.video_id)
        job.progress(100)
        done(null, 'success')
    } catch (e) {
        done(e)
    }
})

youtubeQueue.on('active', (job, jobPromise) => {
   logger.info(`[youtubeQueue] job ${job.id} has started`)
})

youtubeQueue.on('progress', (job, progress) => {
   logger.info(`[youtubeQueue] job ${job.id} is ${progress}% complete`)
})

youtubeQueue.on('completed', (job, result) => {
   logger.info(`[youtubeQueue] job ${job.id} has completed with the result ${result}`)
    // TODO: refactor - we need to emit the refresh signal to
    // the client to get the queue list to reload - event bus
    // will be responsible for this.
    //io.in(job.data.user.id).emit('queue:reload')
})

youtubeQueue.on('failed', async (job) => {
   logger.error(`[youtubeQueue] job ${job.id} has failed: ${job.failedReason}`)
    if(job.attemptsMade >= job.opts.attempts) {
        const video = await db('videos').where('id', job.data.video_id)
        if(video[0].redeem_id) {
            // TODO: refunding channel points would happen here
        }
        // last step: remove unprocessed record from videos table
        await db('videos').delete().where('id', job.data.video_id)
    }
})

youtubeQueue.on('stalled', (job) => {
   logger.warn(`[youtubeQueue] job ${job.id} has stalled`)
})

youtubeQueue.on('drained', () => {
   logger.info('[youtubeQueue] no more jobs left in the queue')
})

export default youtubeQueue;