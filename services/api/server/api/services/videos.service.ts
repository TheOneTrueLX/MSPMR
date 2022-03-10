import { Types as mongooseTypes } from 'mongoose';
import L from '../../common/logger'
import * as HttpStatus from 'http-status-codes';
import * as errors from "../../common/errors";

import { Video, IVideoModel } from '../models/video';

export class VideosService {

  async all(): Promise<IVideoModel[]> {
    L.info('fetch all videos');

    const docs = await Video
      .find()
      .lean()
      .exec() as IVideoModel[];

    return docs;
  }

  async byId(id: string): Promise<IVideoModel> {
    L.info(`fetch video with id ${id}`);

    if (!mongooseTypes.ObjectId.isValid(id)) throw new errors.HttpError(HttpStatus.BAD_REQUEST);

    const doc = await Video
      .findOne({ _id: id })
      .lean()
      .exec() as IVideoModel;

    if (!doc) throw new errors.HttpError(HttpStatus.NOT_FOUND);

    return doc;
  }

  async create(videoData: IVideoModel): Promise<IVideoModel> {
    L.info(`create video with data ${videoData}`);

    const video = new Video(videoData);

    const doc = await video.save() as IVideoModel;

    return doc;
  }

  async patch(id: string, videoData: IVideoModel): Promise<IVideoModel> {
    L.info(`update video with id ${id} with data ${videoData}`);

    const doc = await Video
      .findOneAndUpdate({ _id: id }, { $set: videoData }, { new: true })
      .lean()
      .exec() as IVideoModel;

    return doc;
  }

  async remove(id: string): Promise<any> {
    L.info(`delete video with id ${id}`);

    return await Video
      .findOneAndRemove({ _id: id })
      .lean()
      .exec();
  }
}

export default new VideosService();