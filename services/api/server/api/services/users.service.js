import l from '../../common/logger';
import db from '../../db';
import axios from 'axios';

class UsersService {
  async currentUser(u) {
    l.info(`${this.constructor.name}.currentUser()`);
    const user = await db('users').where({ id: u.id })
    // if the last field update + expires_at is <= current date, the tokens
    // we got from Twitch are expired.
    if(user.expires_at && user.expires_at <= Date.now()) {
      l.warn(`Refreshing Twitch oauth token for user ${user.username} (${user.id})`)
      // Tokens are expired - remove stale tokens from db 
      // TODO: this might be a good place to handle refresh tokens

      payload = {
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: user.refresh_token
      }

      try {
        const { data } = await axios.post('https://id.twitch.tv/oauth2/token', payload, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })

        await db('users').where({ id: u.id })
        .update({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires_in: new Date(new Date().getTime() + (14124 * 1000))
        })
      
      } catch (err) {
        await db('users').where({ id: u.id })
        .update({
          access_token: null,
          refresh_token: null,
          expires_at: null
        })
      }
    }
    const authUser = await db('users').select('id','username','overlay_api_key','profile_image','current_channel','created_at','updated_at').where({ id: u.id });
    return authUser[0];
  }
}

export default new UsersService();
