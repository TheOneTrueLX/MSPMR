import AuthService from '../../services/auth.service';

export class Controller {

  callback(req, res) {
    AuthService.callback(code).then((r) => {
      if (r) res.json(r);
      else res.status(400).end();
    })
  }

  refresh(req, res) {
    res.status(501).end();
  }

}
export default new Controller();
