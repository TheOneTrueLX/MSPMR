import VideosService from '../../services/videos.service'
import { Request, Response, NextFunction } from 'express';
import { google } from 'googleapis'
import * as HttpStatus from 'http-status-codes';
import L from '../../../common/logger'
import { IVideoModel } from '../../models/video';

const videoServices = [
  { youtube: /(.*\.)?youtu(\.be|be\.com)?/ },
  // { twitch: /(.*\.)?twitch\.tv/ },
  // { discord: /(.*\.)?discord\.gg/ }
]

export class Controller {

  async all(req: Request, res: Response, next: NextFunction) {
    try {
      const docs = await VideosService.all();
      return res.status(HttpStatus.OK).json(docs);
    }
    catch (err) {
      return next(err);
    }
  }

  async byId(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await VideosService.byId(req.params.id);
      return res.status(HttpStatus.OK).json(doc);
    }
    catch (err) {
      return next(err);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    
    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.YT_API_KEY
    })

    // Get URL from channel point redeem message
    var url: URL = null
  
    // Check to make sure the URL is a valid URL
    try {
      url = new URL(req.body.url);
    } catch (err) {
      // invalid/malformed URL
      L.error(err);
      return next(err);
    }

    // Check to make sure the URL points to a supported site
    var service: string | boolean = false
    videoServices.forEach((value) => {
      // have to kind of jump through some hoops in order
      // to test on regex inside of an array of objects
      for(const property in value) {
        if(value[property].test(url.hostname)) {
          service = property
        }
      }
    })

    if(!service) {
      // if we didn't match a service above, then
      // we're assuming that the URL wasn't from
      // a site that the app supports.
      return res.status(HttpStatus.BAD_REQUEST).send();
    }
    
    // pre-build payload for addition to the video queue
    var video: IVideoModel = {
      service_id: null,
      service: service,
      title: null,
      duration: null,
      copyrightClaimed: null,
      redeemId: null,
      submitter: req.body.submitter,
      submissionDate: (new Date()).getTime(),
      played: false
    }

    switch(service) {
      case 'youtube':

        try {
          // fetch video information from YT API based on video ID
          const videoInfo = await youtube.videos.list({
            id: [url.searchParams.get('watch')],
            part: ['snippet','contentDetails']
          })
    
          // fill in the blanks on the payload
          video.service_id = videoInfo.data.items[0].id;
          video.title = videoInfo.data.items[0].snippet.description;
          video.duration = (new Date(videoInfo.data.items[0].contentDetails.duration)).getTime();
          video.copyrightClaimed = videoInfo.data.items[0].contentDetails.licensedContent;
        } catch (err) {
          // presumably a YT API error
          L.error(err)
          return next(err)         
        }
  
        break;

      case 'twitch':

      case 'discord':

      default:
        return res.status(HttpStatus.NOT_IMPLEMENTED).send()
    }

    try {
      const doc = await VideosService.create(video);
      return res.status(HttpStatus.CREATED).location(`/api/v1/videos/${doc._id}`).json(doc);
    }
    catch (err) {
      return next(err);
    }
  }

  async patch(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await VideosService.patch(req.params.id, req.body);
      return res.status(HttpStatus.OK).location(`/api/v1/videos/${doc._id}`).json(doc);
    }
    catch (err) {
      return next(err);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await VideosService.remove(req.params.id);
      return res.status(HttpStatus.NO_CONTENT).send();
    }
    catch (err) {
      return next(err);
    }
  }

}

export default new Controller();
