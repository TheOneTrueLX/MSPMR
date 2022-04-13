import l from '../../../common/logger';
import UsersService from '../../services/users.service';

export class Controller {
  async currentUser(req, res) {
    l.debug(JSON.stringify(req.session.user))
    if('user' in req.session) {
      UsersService.currentUser(req.session.user).then((r) => {
        if (r) res.json(r);
        else res.status(401).end();
      });
    } else {
      res.status(401).end();
    }
  }
}
export default new Controller();
