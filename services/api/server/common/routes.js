import authRouter from '../api/controllers/auth/router';
import userRouter from '../api/controllers/users/router';
import channelRouter from '../api/controllers/channels/router';

export default function routes(app) {
  // Controller-defined route handlers
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/channels', channelRouter);

  // Default route handler
  app.all('*', (req, res) => {
    res.status(404).json({ code: 400, message: 'Not Found' })
  })
}
