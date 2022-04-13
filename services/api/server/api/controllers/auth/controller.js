import AuthService from '../../services/auth.service';
import l from '../../../common/logger';

export class Controller {

  callback(req, res) {
    AuthService.callback(req.body.code).then((r) => {
      if (r) {
        req.session.user = r;
        res.status(200).json(r);
      } else {
        res.status(400).json({ code: 400, message: 'malformed callback from frontend - possibly didn\'t get code from Twitch oauth API' });
      }
    }).catch((err) => {
      l.error(`Auth service error: ${err}`)
      if(err.response) {
        res.status(err.response.status).json(err.response.data)
      } else {
        res.status(500).json({ code: 500, message: err })
      }
    })
  }

  logout(req, res) {
    if(req.session.user) delete req.session.user;
    res.status(200).json({ message: 'User logged out'});
  }

}
export default new Controller();
