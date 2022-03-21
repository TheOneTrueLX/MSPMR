import redisClient from '../../../common/redis'
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { promises as fs } from 'fs';
import * as HttpStatus from 'http-status-codes';
import L from '../../../common/logger'

export class Controller {

  async callback(req: Request, res: Response, next: NextFunction) {
    try {
      if(req.query.code) {
        L.info('Requesting access token from Twitch API...')
        axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&code=${req.query.code}&grant_type=authorization_code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback`)
        .then((apiRes) => {
          L.info('Saving access token...');
          // this.save(apiRes.data);
          redisClient.set('oauth_tokens', JSON.stringify(req.body, null, 4));
          fs.writeFile('./tokens.json', JSON.stringify(req.body, null, 4), 'utf-8');
          L.info(`saved Twitch API oauth2 tokens`);
        }).catch((err) => {
          L.error(err.toJSON());
        })
        return res.status(HttpStatus.NO_CONTENT).send();
      } else {
        L.error('Auth code request from frontend missing \'code\' query string parameter');
      }
    } catch (err) {
      return next(err);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = JSON.parse(await fs.readFile('./tokens.json', 'utf-8'));
      L.debug(`${JSON.stringify(accessToken)}`)
      // const authProvider = new StaticAuthProvider(process.env.TWITCH_CLIENT_ID, accessToken.access_token, accessToken.scope);
      // const apiClient = new ApiClient({ authProvider });
      // const user = apiClient.users.getMe();
      axios.get('https://api.twitch.tv/helix/users', {
          headers: {
            'Authorization': `Bearer ${accessToken.access_token}`,
            'Client-Id': process.env.TWITCH_CLIENT_ID
          }
        }
      ).then((apires) => {
        L.info('Successfully got broadcaster info from Twitch')
        return res.status(HttpStatus.OK).json(apires.data);
      }).catch((err) => {
        L.error(err)
        L.debug(err.toJSON())
      })     
    } catch (err) {
      return next(err);
    }
  }

  async save(req: Request, res: Response, next: NextFunction) {
    try {
      await redisClient.set('oauth_tokens', JSON.stringify(req.body, null, 4));
      await fs.writeFile('./tokens.json', JSON.stringify(req.body, null, 4), 'utf-8');
      L.info(`saved Twitch API oauth2 tokens`);
      return res.status(HttpStatus.NO_CONTENT).send();
    }
    catch (err) {
      return next(err);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      L.info(`deleting saved Twitch API auth tokens`);
      redisClient.del('oauth_tokens');
      await fs.unlink('./tokens.json');
      return res.status(HttpStatus.NO_CONTENT).send();
    }
    catch (err) {
      return next(err);
    }
  }
}

export default new Controller();
