import l from '../../common/logger';
import models from '../../db';
import { generateAccessToken } from '../../common/jwt';

class AuthService {

  callback(code) {
    const oauth2_payload = {
      client_id: process.env.TWITCH_CLIENT_ID,
      client_secret: process.env.TWITCH_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: process.env.FRONTEND_AUTH_REDIRECT
    }

    // Return the code back to the Twitch oauth2 API and get
    // the access/refresh tokens for the user. This is the last step
    // in the authorization code workflow.
    axios.post('https://id.twitch.tv/oauth2/token', oauth2_payload).then((oauth2_res) => {

      // On successful completion of the oauth2 authorization code workflow,
      // we next need to query the Helix API to get the user's ID, display
      // name, and e-mail address to complete our local user record.
      axios.get('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${oauth2_res.access_token}`,
          Client-Id: process.env.TWITCH_CLIENT_ID,
        }
      }).then((tapi_res) => {
        
        // Checking for an existing user here.  If one exists, we don't
        // need to insert a new record.  We will still need to update
        // the access/refresh tokens, though.
        const [user, created] = models.User.findOrCreate({
          // Twitch user IDs are immutable, so that's what we search by
          where: { twitch_clientid: tapi_res.id },
          defaults: {
            twitch_username: tapi_res.display_name,
            twitch_userid: tapi_res.id,
            email: tapi_res.email
          }
        })

        if(created) {
          l.info(`Added new user ${user.twitch_username} (#${user.twitch_userid})`)
        } else {
          l.info(`Updating existing user ${user.twitch_username} (#${user.twitch_userid})`)
        }

        // Check the API response for updated usernames/e-mail addresses
        if(user.twitch_username != tapi_res.display_name) {
          user.twitch_username = tapi_res.display_name
        }

        if(user.email != tapi_res.email) {
          user.email = tapi_res.email
        }

        // Update the authentication tokens returned by the oauth2 API
        user.access_token = oauth2_res.access_token
        user.refresh_token = oauth2_res.refresh_token
        user.expires_in = oauth2_res.expires_in
        await user.save()
        
        // Generate a JWT and send it back to the controller
        return generateAccessToken(user.twitch_clientid)

      }).catch((tapi_err) => {
        l.error(`Twitch API Error: ${tapi_err}`)
        return null;
      })
    }).catch((oauth2_err) => {
      l.error(`Twitch Oauth2 Error: ${oauth2_err}`)
      return null;
    })
  }

  refreshToken(token) {
    // TODO: add code for refreshing a token
  } 

}

export default new AuthService();
