import * as express from 'express';
import controller from './controller';
import requireAuthorizedUser from '../../middlewares/auth.handler';

export default express
  .Router()
  .get('/', requireAuthorizedUser, controller.all)
  .post('/', requireAuthorizedUser, controller.add)
  .delete('/:id', requireAuthorizedUser, controller.delete);
