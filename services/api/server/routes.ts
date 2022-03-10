import { Application } from 'express';
import videosRouter from './api/controllers/videos/router'

export default function routes(app: Application): void {
  app.use('/api/v1/videos', videosRouter);
};