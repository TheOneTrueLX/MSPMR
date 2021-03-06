import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .post('/callback', controller.callback)
  .delete('/logout', controller.logout);