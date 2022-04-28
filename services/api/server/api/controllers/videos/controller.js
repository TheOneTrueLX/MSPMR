import VideosService from '../../services/videos.service'

export class Controller {
  all(req, res) {
    VideosService.all(req).then((r) => res.json(r));
  }

  add(req, res) {
    VideosService.add(req).then((r) => res.json(r));
  }

  delete(req, res) {
    VideosService.delete(req).then((r) =>
      res.status(201).location(`/api/v1/videos/${r.id}`).json(r)
    );
  }
}
export default new Controller();
