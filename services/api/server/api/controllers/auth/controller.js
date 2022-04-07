import AuthService from '../../services/auth.service';
import l from '../../../common/logger';

export class Controller {

  callback(req, res) {
    AuthService.callback(req.body.code).then((r) => {
      if (r) res.json(r);
      else res.status(400).json({ code: 400, message: 'malformed callback from frontend - possibly didn\'t get code from Twitch oauth API' });
    }).catch((err) => {
      l.error(`Auth service error: ${err}`)
      res.status(500).json({ code: 500, message: err })
    })
  }

  refresh(req, res) {
    res.status(501).json({ code: 501, message: 'Not Implemented' });
  }

}
export default new Controller();
