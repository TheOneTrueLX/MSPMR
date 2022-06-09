import l from '../../common/logger';
import db from '../../db';
import youtubeQueue from '../queues/youtube.queue';

export async function getCurrentVideoSortIndex(channel_id) {
  try {
    const sort_index = await db('videos').max('sort_index as max_sort').where('channels_id', channel_id).andWhere('status', 'processed')
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

async function isAuthorized(user_id, video_id) {
  const user = await db('users').where('id', user_id)
  const channel = await db('channels').where('owner_id', user_id)
  const video = await db('videos').where('id', video_id)

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

  return isAuthorized
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

  async delete(req) {
    l.info(`${this.constructor.name}.delete()`)
    const auth = await isAuthorized(req.session.user.id, req.params.id)
    if(auth) {
      return await db('videos').where('id', req.params.id).delete('id')
      // TODO: going to need to refund channel points here
    } else {
      return {};
    }
  }

  async currentVideo(req) {
    var user = []
    var channel = []
    var video = []

    try {
      user = await db('users').where('overlay_api_key', req.params.apikey)
      if(user.length > 0) {
        channel = await db('channels').select('id').where('owner_id', user[0].id)
        video = await db('videos').where('channels_id', channel[0].id).orderBy('sort_index').limit(1)
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
