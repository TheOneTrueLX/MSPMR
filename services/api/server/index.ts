import './common/env';
import ApiServer from './common/server';

const port = parseInt(process.env.PORT);

export default new ApiServer().listen(port);

