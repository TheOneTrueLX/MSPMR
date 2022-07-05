import * as express from 'express';
import controller from './controller';
import { requireAuthorizedUser } from '../../middlewares/auth.handler';

export default express
  .Router()
  .get('/current', requireAuthorizedUser, controller.currentUser)
  .get('/auth', controller.isAuthenticated)
  .patch('/beta', controller.betaAuth)
  .patch('/eula', controller.acceptEula)
  

