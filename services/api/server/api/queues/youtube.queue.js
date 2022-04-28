import Queue from 'bull';
import puppeteer from 'puppeteer';
import db from '../../db'
import l from '../../common/logger';

const youtubeQueue = new Queue('youtube-metadata-queue', 'redis://127.0.0.1:6379');

async function scrape(url) {
    l.debug(`Attempting to scrape metadata from ${url}...`)
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
        duration = (+a[0]) * 60 * 60 + (+a[1]) * 60;
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
    
    l.debug(`Fetched the following from Youtube: ${JSON.stringify(payload)}`)
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
        l.info(`[Job ${job.id}] submitted to queue with payload ${JSON.stringify(job.data)}`)
        const result = await scrape(job.data.url);
        l.info(`[Job ${job.id}] updating video record #${job.data.id}`)
        await db('videos').update({
            title: result.title,
            duration: result.duration,
            copyright: result.copyright,
            redeem_id: job.data.redeem_id || null,
            status: 'processed'
        }).where({ id: job.data.id })
        l.info(`[Job ${job.id}] wrapping up`)
        done();
    } catch (e) {
        done(e)
    }

})

youtubeQueue.on('completed', job => {
    l.info(`[youtubeQueue] job with id ${job.id} has completed`)
})

export default youtubeQueue;