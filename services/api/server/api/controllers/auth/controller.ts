import redisClient from '../../../common/redis'
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import fs from 'fs';
import * as HttpStatus from 'http-status-codes';
import L from '../../../common/logger'

interface IAccessToken {
  access_token: string,
  refresh_token: string,
  expires_in: number,
  scope?: Array<string>,
  token_type?: string
}

async function getAccessToken(): Promise<IAccessToken | null> {
  try {
    const stat = await fs.promises.stat('./tokens.json');

    const accessToken: IAccessToken = JSON.parse(await fs.promises.readFile('./tokens.json', 'utf-8'));
    if (stat.mtime.getTime() + (accessToken.expires_in * 1000) <= (new Date).getTime()) {
      const payload = {
        grant_type: 'refresh_token',
        refresh_token: accessToken.refresh_token,
        client_id: process.env.TWITCH_CLIENT_ID,
        client_secret: process.env.TWITCH_CLIENT_SECRET      
      };
      const newAccessToken: AxiosResponse = await axios.post('https://id.twitch.tv/oauth2/token', payload);
      redisClient.set('oauth_tokens', JSON.stringify(newAccessToken.data, null, 4));
      await fs.promises.writeFile('./tokens.json', JSON.stringify(newAccessToken.data, null, 4), 'utf-8');
      return newAccessToken.data as IAccessToken;
    } else {
      return accessToken;
    }

  } catch (err) {

    if (err.code === "ENOENT") {
      // tokens.json missing
      L.warn('tokens.json not found - does user need to reauth?')
      L.debug(JSON.stringify(err, null, 4))
      return null
    } else {
      // something else went wrong but we're gonna do
      // exactly the same thing
      L.error(`Error reading token data: ${err}`)
      L.debug(JSON.stringify(err, null, 4))
    }

  }
  // The function shouldn't make it this far without
  // returning something -- so we'll return null just
  // as a failsafe.
  return null;
}

export class Controller {

  async callback(req: Request, res: Response, next: NextFunction) {
    try {
      if(req.query.code) {
        L.info('Requesting access token from Twitch API...')
        axios.post(`https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&code=${req.query.code}&grant_type=authorization_code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback`)
        .then((apiRes) => {
          L.info('Saving access token...');
          redisClient.set('oauth_tokens', JSON.stringify(apiRes.data, null, 4));
          fs.promises.writeFile('./tokens.json', JSON.stringify(apiRes.data, null, 4), 'utf-8');
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
      if(await redisClient.exists('user_info')) {
        // user data cached so we get it from redis
        L.info('Returning cached user data from redis')
        const userInfo = JSON.parse(await redisClient.get('user_info'));
        return res.status(HttpStatus.OK).json(userInfo);
      } else {
        // no user data cached so we get it from Twitch
        const accessToken = await getAccessToken()
        if (accessToken) {
          axios.get('https://api.twitch.tv/helix/users', {
              headers: {
                'Authorization': `Bearer ${accessToken.access_token}`,
                'Client-Id': process.env.TWITCH_CLIENT_ID
              }
            }
          ).then((apires) => {
            L.info('Successfully got broadcaster info from Twitch')
            redisClient.set('user_info', JSON.stringify(apires.data, null, 4), { EX: 86400 })
            return res.status(HttpStatus.OK).json(apires.data);
          }).catch((err) => {
            L.error(err)
            L.debug(err.toJSON())
            return next(err);
          })     
        } else {
          return res.status(HttpStatus.UNAUTHORIZED).send()
        }
      }
    } catch (err) {
      return next(err);
    }
  }

  async save(req: Request, res: Response, next: NextFunction) {
    try {
      await redisClient.set('oauth_tokens', JSON.stringify(req.body, null, 4));
      await fs.promises.writeFile('./tokens.json', JSON.stringify(req.body, null, 4), 'utf-8');
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
      await fs.promises.unlink('./tokens.json');
      return res.status(HttpStatus.NO_CONTENT).send();
    }
    catch (err) {
      return next(err);
    }
  }
}

export default new Controller();
