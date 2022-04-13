import l from '../../common/logger';
import db from '../../db';
import axios from 'axios';

class AuthService {

  async callback(code) {
    const oauth2_payload = {
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      code: code || 'undefined',
      grant_type: 'authorization_code',
      redirect_uri: process.env.FRONTEND_AUTH_REDIRECT
    }

    // Return the code back to the Twitch oauth2 API and get
    // the access/refresh tokens for the user. This is the last step
    // in the authorization code workflow.
    var oauth2_res;
    
    try {
      oauth2_res = await axios.post('https://id.twitch.tv/oauth2/token', oauth2_payload);
    } catch (e) {
      l.error(`Twitch oauth2 error: ${e}`);
      l.debug(e.stack);
      throw(e);
    }


    // On successful completion of the oauth2 authorization code workflow,
    // we next need to query the Helix API to get the user's ID, display
    // name, and e-mail address to complete our local user record.
    var tapi_res;

    try {
      tapi_res = await axios.get('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${oauth2_res.data.access_token}`,
          'Client-Id': process.env.TWITCH_CLIENT_ID,
        }
      });
    } catch (e) {
      l.error(`Twitch API error: ${e}`);
      l.debug(e.stack);
      throw(e);
    }

    // Checking for an existing user here.  If one exists, we don't
    // need to insert a new record.  We will still need to update
    // the access/refresh tokens, though.
    var user;

    try {
      user = await db('users').where('id', tapi_res.data.data[0].id);
      if(user.length > 0) {
        // update existing user
        await db('users')
          .where('id', tapi_res.data.data[0].id)
          .update({
            username: tapi_res.data.data[0].display_name,
            profile_image: tapi_res.data.data[0].profile_image_url,
            email: tapi_res.data.data[0].email,
            access_token: oauth2_res.data.access_token,
            refresh_token: oauth2_res.data.refresh_token,
            expires_at: new Date(new Date().getTime() + (oauth2_res.data.expires_in * 1000))
          });
      } else {
        // create new user
        await db('users').insert({
          id: tapi_res.data.data[0].id,
          username: tapi_res.data.data[0].display_name,
          profile_image: tapi_res.data.data[0].profile_image_url,
          email: tapi_res.data.data[0].email,
          access_token: oauth2_res.data.access_token,
          refresh_token: oauth2_res.data.refresh_token,
          expires_at: new Date(new Date().getTime() + (oauth2_res.data.expires_in * 1000))
        });
      }

      // Since knex returns an array of objects (good), we need to
      // manually reload the user record to "refresh" the user "object"
      // since there's no special magic to do it.
      user = await db('users').select('id','username','profile_image','created_at','updated_at').where('id', tapi_res.data.data[0].id);
    } catch (e) {
      l.error(`MSPMR DB Error: ${e}`);
      l.debug(e.stack);
      throw(e);
    }

    // return the user object back to the controller
    return user[0]
  
  }

}

export default new AuthService();
