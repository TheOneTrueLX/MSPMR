import l from '../../common/logger';
import db from '../../db';
import axios from 'axios';

// MAKE SURE THESE ARE LOWER CASE!
// Also TODO: find a more elegant way to do this
const KNOWN_MODBOTS = [
  'nightbot',
  'moobot',
  'streamelements',
  'streamlabs',
]

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
    var tapi_user_res;

    try {
      tapi_user_res = await axios.get('https://api.twitch.tv/helix/users', {
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
      user = await db('users').where('id', tapi_user_res.data.data[0].id);
      if(user.length > 0) {
        // update existing user
        await db('users')
          .where('id', tapi_user_res.data.data[0].id)
          .update({
            username: tapi_user_res.data.data[0].display_name,
            profile_image: tapi_user_res.data.data[0].profile_image_url,
            email: tapi_user_res.data.data[0].email,
            access_token: oauth2_res.data.access_token,
            refresh_token: oauth2_res.data.refresh_token,
            expires_at: new Date(new Date().getTime() + (oauth2_res.data.expires_in * 1000))
          });
      } else {
        // create new user
        await db('users').insert({
          id: tapi_user_res.data.data[0].id,
          username: tapi_user_res.data.data[0].display_name,
          profile_image: tapi_user_res.data.data[0].profile_image_url,
          email: tapi_user_res.data.data[0].email,
          access_token: oauth2_res.data.access_token,
          refresh_token: oauth2_res.data.refresh_token,
          expires_at: new Date(new Date().getTime() + (oauth2_res.data.expires_in * 1000))
        });
      }
      
      // Since knex returns an array of objects (good), we need to
      // manually reload the user record to "refresh" the user "object"
      // since there's no special magic to do it.
      user = await db('users').select('id','username','profile_image','created_at','updated_at').where('id', tapi_user_res.data.data[0].id);
    } catch (e) {
      l.error(`MSPMR DB Error: ${e}`);
      l.debug(e.stack);
      throw(e);
    }

    var channel;
    try {
      // this is a good place to check to see if we have a channel record for this user.
      channel = await db('channels').where({ owner_id: user[0].id })
      if(channel.length === 0) {
        // this user doesn't have a channel record yet so let's make one
        await db('channels').insert({ owner_id: user[0].id })
      }

    } catch (e) {
      l.error(`MSPMR DB Error: ${e}`);
      l.debug(e.stack);
      throw(e);
    }

    var tapi_mods_res;
    try {
      // get the list of mods for the channel from the Twitch API
      tapi_mods_res = await axios.get(`https://api.twitch.tv/helix/moderation/moderators?broadcaster_id=${user[0].id}`,{
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

    try {
      // no point in continuing if the channel doesn't have any mods...
      if(tapi_mods_res.data.data.length > 0) {
        await db('users_channels').where({ channels_id: channel.id }).delete()
        var refresh_mods = [];
        tapi_mods_res.data.data.forEach((mod) => {
          // While we're here, we need to make sure user accounts are created
          // for the mods being added.  These are just stub accounts without
          // e-mail addresses or any sort of Twitch oauth interaction; they
          // exist just so that we can establish a parent-child relationship
          // between mods and channels.

          // RANT: this would be a lot easier there was a Twitch API endpoint
          // that let you query a broadcaster for a list of channels they
          // have moderator access to.

          // This is especially bad since the mod list can only be updated
          // whenever a channel owner logs in, so best case scenario every
          // seven days.  Short term, we'll just make sure to note this 
          // in the user documentation (HA!).  Long term, maybe we restrict
          // mod access unless there's an active media share session?
          var mod_check = await db('users').where({ id: mod.id }).count()
          if(mod_check === 0 && KNOWN_MODBOTS.includes(String(mod.user_name).toLowerCase())) {
            await db('users').insert({
              id: mod.user_id,
              username: mod.user_name,
            })
          }

          // next, we build the payload that we'll use to insert the mods
          // back into the users_channels table...
          refresh_mods.push({ users_id: mod.user_id, channels_id: channel.id })
        })
        // dump our (pay)load into the database
        await db('users_channels').insert(refresh_mods)
      }
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