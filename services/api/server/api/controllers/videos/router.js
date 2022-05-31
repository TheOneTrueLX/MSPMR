import * as express from 'express';
import controller from './controller';
import requireAuthorizedUser from '../../middlewares/auth.handler';

export default express
  .Router()
  .get('/:username', controller.byUser)
  .get('/', requireAuthorizedUser, controller.all)
  .get('/current/:apikey', controller.currentVideo)
  .post('/', requireAuthorizedUser, controller.add)
  .delete('/:id', requireAuthorizedUser, controller.delete);
