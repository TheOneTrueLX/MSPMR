import l from '../../common/logger';
import db from '../../db';

class ChannelsService {
  async all(req) {
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
        l.debug(JSON.stringify(mod_channels))
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
}

export default new ChannelsService();
