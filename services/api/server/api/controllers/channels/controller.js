import ChannelsService from '../../services/channels.service';

export class Controller {
  all(req, res) {
    ChannelsService.all(req).then((r) => res.json(r));
  }
}
export default new Controller();
