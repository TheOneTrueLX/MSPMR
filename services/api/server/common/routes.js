import authRouter from '../api/controllers/auth/router';

export default function routes(app) {
  // Controller-defined route handlers
  app.use('/api/v1/auth', authRouter);

  // Default route handler
  app.all('*', (req, res) => {
    res.status(404).json({ code: 400, message: 'Not Found' })
  })
}
