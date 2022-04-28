import l from '../../common/logger';
import db from '../../db';

class ChannelsService {
  async all(req) {
    l.info(`${this.constructor.name}.all()`);
    var results = [];

    // First we get the user's primary channel
    try {
      const primary_channel = await db.select('a.id', 'b.username')
        .from('channels as a')
        .leftJoin('users as b', 'a.owner_id', 'b.id')
        .where('b.id', req.session.user.id)
      
      results.push({ channel_id: primary_channel[0].id, channel_name: req.session.user.username, user_status: 'owner' })
    } catch (e) {
      l.error(`MSPMR DB Error: ${e}`);
      l.debug(e.stack);
      throw(e);
    }

    // Next we get any channels where the user is the moderator
    try {
      const mod_channels = await db.select('c.id', 'd.username')
        .from('users as a')
        .leftJoin('users_channels as b', 'a.id', 'b.users_id')
        .leftJoin('channels as c', 'b.channels_id', 'c.id')
        .leftJoin('users as d', 'c.owner_id', 'd.id')
        .where('a.id', req.session.user.id);
      mod_channels.forEach((channel) => {
        if(channel.id !== null && channel.username !== null) {
          results.push({ channel_id: channel.channels_id, channel_name: channel.username, user_status: 'mod' })
        }
      })
    } catch (e) {
      l.error(`MSPMR DB Error: ${e}`);
      l.debug(e.stack);
      throw(e);
    }

    return results;
  }

  async setCurrent(req) {
    l.info(`${this.constructor.name}.setCurrent()`);
    try {
      // This method will not permit a user to change to a channel that they 
      // are not either an owner or moderator for. 
      const own_channel = await db('channels').select('id').where('owner_id', req.session.user.id)
      const channel_list = await db('users_channels').select('channels_id').where('users_id', req.session.user.id)
      if((own_channel[0].owner_id == req.params.channel_id) || (channel_list.find(o => o.channel_id == req.params.channel_id))) {
        // if the change is permitted, update the table and the session object
        await db('users').update('current_channel', req.params.channel_id).where('id', req.session.user.id);
        req.session.user.current_channel = req.params.channel_id;
        
        // return the updated user object
        return req.session.user;
      } else {
        // Otherwise, do nothing and send back the unaltered user object
        return req.session.user;
      }
    } catch (e) {
      l.error(`MSPMR API Error: ${e}`);
      l.debug(e.stack);
      throw(e);
    }
  }
}

export default new ChannelsService();
