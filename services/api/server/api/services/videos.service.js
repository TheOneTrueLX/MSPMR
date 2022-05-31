import l from '../../common/logger';
import db from '../../db';
import youtubeQueue from '../queues/youtube.queue';

class VideosService {
  async all(req) {
    l.info(`${this.constructor.name}.all()`);
    var videos;
    try {
      videos = await db('videos').where({
        channels_id: req.session.user.current_channel,
        status: 'processed'
      })
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
      await db('videos').insert({
        channels_id: req.session.user.current_channel,
        submitter: req.body.submitter || req.session.user.username,
        service_type: 'youtube', // hard coded for now
        video_url: req.body.url,
        status: 'pending'
      })
      // since mysql doesn't support returning() we need to jump through some
      // hoops to get the record that was just inserted
      const video = await db('videos').select(['id','video_url']).where({
          channels_id: req.session.user.current_channel,
          video_url: req.body.url,
          status: 'pending'
        }).orderBy('created_at', 'desc').limit(1)
      youtubeQueue.add({ id: video[0].id, url: video[0].video_url })
      return video[0];
    } catch (e) {
      l.error(`MSPMR DB Error: ${e}`);
      l.debug(e.stack);
      throw(e);
    }
  }

  async byUser(req) {
    var user = [];
    var data = [];
    try {
      user = await db('users').where('username', req.params.username)
      const channels = await db('channels').where('owner_id', user[0].id)
      data = await db('videos').where({
        channels_id: channels[0].id,
        status: 'processed'
      })
    } catch (e) {
      l.error(`MSPMR DB Error: ${e}`)
      l.debug(e.stack);
      throw(e);
    }

    return {
      meta: {
        username: user[0].username,
      },
      data: data,
    }
  }

  delete(req) {
    l.info(`${this.constructor.name}.delete()`);
    return db(videos).where('id', req.params.id).delete('id');
  }

  async currentVideo(req) {
    var user = []
    var channel = []
    var video = []

    try {
      user = await db('users').where('overlay_api_key', req.params.apikey)
      if(user.length > 0) {
        channel = await db('channels').select('id').where('owner_id', user[0].id)
        video = await db('videos').where('channels_id', channel[0].id).limit(1)
      } else {
        return {}
      }
    } catch (e) {
      l.error(`MSPMR DB Error: ${e}`)
      l.debug(e.stack)
      throw(e)
    }

    return {
      meta: {
        id: user[0].id,
        userName: user[0].username,
        channelId: channel[0].id,
      },
      data: video[0],
    }
  }
}

export default new VideosService();
