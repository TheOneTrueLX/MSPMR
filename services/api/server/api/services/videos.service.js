import l from '../../common/logger';
import db from '../../db';
import youtubeQueue from '../queues/youtube.queue';

class VideosService {
  async all(req) {
    l.info(`${this.constructor.name}.all()`);
    var videos;
    try {
      videos = await db('videos').where('channels_id', req.session.user.current_channel)
    } catch (e) {
      l.error(`MSPMR DB error: ${e}`)
      throw(e);
    }
    return videos;
  }

  async add(req) {
    l.info(`${this.constructor.name}.add()`);

    try {
      // add the initial video info in the db in a 'pending' state
      const video = await db('videos').insert({
        channels_id: req.session.user.current_channel,
        submitter: req.body.submitter || req.session.user.username,
        service_type: 'youtube', // hard coded for now
        video_url: req.body.url,
        status: 'pending'
      }, ['id', 'video_url'])
    } catch (e) {
      l.error(`MSPMR DB Error: ${e}`);
      l.debug(e.stack);
      throw(e);
    }

    // submit the video to the metadata processing queue
    videoQueue.add({ id: video[0].id, url: video[0].video_url })

    return video[0];
  }

  delete(req) {
    l.info(`${this.constructor.name}.delete()`);
    return db(videos).where('id', req.params.id).delete('id');
  }
}

export default new VideosService();
