import l from '../../common/logger';
import db from '../../db';
import youtubeQueue from '../queues/youtube.queue';

export async function getCurrentVideoSortIndex(channel_id) {
  try {
    const sort_index = await db('videos').max('sort_index as max_sort').where('channels_id', channel_id).andWhere('status', 'processed')
    l.debug(sort_index)
    if(sort_index[0].max_sort) {
      return (sort_index[0].max_sort + 1)
    } else {
      return 1
    }
  } catch (e) {
    l.error(`Unable to get sort index for channel ${channel_id}: ${e}`)
    l.debug(e.stack)
    throw(e)
  }
}

class VideosService {
  async all(req) {
    l.info(`${this.constructor.name}.all()`);
    var videos;
    try {
      videos = await db('videos').where({
        channels_id: req.session.user.current_channel,
        status: 'processed'
      }).orderBy('sort_index')
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
      youtubeQueue.add({ id: video[0].id, channel_id: req.session.user.current_channel, url: video[0].video_url, user: req.session.user }, { attempts: 3, timeout: 60000 })
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
      }).orderBy('sort_index')
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

  async promoteVideo(req) {
    var channel_id;
    try {
      const target_video = await db('videos').where('id', req.params.video_id)
      channel_id = target_video[0].channels_id
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
        channels_id: req.session.user.current_channel,
        status: 'processed'
      }).orderBy('sort_index')

      return payload

    } catch (e) {
      l.error(`Unable to get sort index for channel ${channel_id}: ${e}`)
      l.debug(e.stack)
      throw(e)
    }
  }
  
  async demoteVideo(req) {
    var channel_id;
    try {
      const target_video = await db('videos').where('id', req.params.video_id)
      channel_id = target_video[0].channels_id
      const prev_video = await db('videos')
        .where('channels_id', target_video[0].channels_id)
        .andWhere('sort_index', '>', target_video[0].sort_index)
        .andWhere('status', 'processed')
        .orderBy('sort_index', 'asc')
        .limit(1)
      
      if(prev_video.length > 0) {
        l.debug(`demoting record id# ${target_video[0].id}`)
        await db('videos').update('sort_index', prev_video[0].sort_index).where('id', target_video[0].id)
        await db('videos').update('sort_index', target_video[0].sort_index).where('id', prev_video[0].id)
      }

      const payload = await db('videos').where({
        channels_id: req.session.user.current_channel,
        status: 'processed'
      }).orderBy('sort_index')
      
      return payload

    } catch (e) {
      l.error(`Unable to get sort index for channel ${channel_id}: ${e}`)
      l.debug(e.stack)
      throw(e)
    }
  }

}

export default new VideosService();
