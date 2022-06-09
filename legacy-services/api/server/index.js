import './common/env';
import Server from './common/server';

export default new Server().listen(process.env.PORT);
