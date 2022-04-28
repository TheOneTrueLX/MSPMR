import Queue from 'bull';
import puppeteer from 'puppeteer';
import db from '../../db'
import l from '../../common/logger';

const youtubeQueue = new Queue('youtube-metadata-queue', 'redis://redis:6379');

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
        duration = await page.evaluate(el => el.innerText, durationElement)
    } catch (e) {
        duration = 'not found'
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
    return {
        url: url,
        title: title,
        duration: duration,
        copyright: result
    };
}

youtubeQueue.process(async function (job, done) {
    // job description:
    // id = corresponds w/ channel ID in db
    // redeem_id = corresponds with the channel point redeem ID from Twitch
    //             (if this is null, we assume the video was manually
    //              submitted through the web front-end)
    // url = youtube video URL

    try {
        var result = await scrape(job.data.url);
        job.progress(75);
        await db('videos').update({
            title: result.title,
            duration: result.duration,
            copyright: result.copyright,
            redeem_id: job.data.redeem_id || null,
            status: 'processed'
        }).where('id', job.data.id)
        done(null, result);
    } catch (e) {
        done(e)
    }

})

youtubeQueue.on('completed', job => {
    l.info(`[youtubeQueue] job with id ${job.id} has completed`)
})

export default youtubeQueue;