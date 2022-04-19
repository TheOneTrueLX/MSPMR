import l from '../../../common/logger';
import UsersService from '../../services/users.service';

export class Controller {
  async currentUser(req, res) {
    if('user' in req.session) {
      UsersService.currentUser(req.session.user).then((r) => {
        if (r) res.json(r);
        else res.status(401).end();
      });
    } else {
      res.status(401).end();
    }
  }

  isAuthenticated(req, res) {
    res.status(200).json('user' in req.session)
  }
}
export default new Controller();
