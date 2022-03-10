import './common/env';
import ApiServer from './common/server';
import routes from './routes';

const port = parseInt(process.env.PORT);

export default new ApiServer()
  .router(routes)
  .listen(port);

