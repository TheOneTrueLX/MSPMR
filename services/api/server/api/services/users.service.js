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
    const authUser = await db('users').select('id','username','overlay_api_key','profile_image','current_channel','created_at','updated_at','beta_authorized','eula_accepted').where({ id: u.id });
    return authUser[0];

  }

  async betaAuth(req) {
    try {
      const betaCode = await db('beta_codes')
      .where('users_id', req.session.user.id)
      .andWhere('beta_key', req.body.key)
      .andWhere('expires_at', '>=', Date.now())
      .orderBy('expires_at', 'desc')
      .limit(1)

      if(betaCode.length == 1) {
        // successful beta code check
        await db('users').update('beta_authorized', true).where('id', req.session.user.id)
        return { status: 200, message: 'beta user authorized' }
      } else {
        return { status: 401, message: 'unauthorized' }
      }
    } catch (e) {
      return { status: 401, message: 'unauthorized' }      
    }
  }

  async acceptEula(req) {
    try {
      await db('users').update('eula_accepted', true).where('id', req.session.user.id)
      return { status: 200, message: 'EULA acknowledged' }
    } catch (e) {
      l.error(e)
      l.debug(e.stack)
      return { status: 500, message: 'Error updating EULA acknowledgement' }
    }
  }

}

export default new UsersService();
