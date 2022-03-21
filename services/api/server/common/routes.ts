import { Application } from 'express';
import videosRouter from '../api/controllers/videos/router'
import authRouter from '../api/controllers/auth/router'

export default function routes(app: Application): void {
  app.use('/api/v1/videos', videosRouter);
  app.use('/api/v1/auth', authRouter);
};