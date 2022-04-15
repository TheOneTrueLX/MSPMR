import l from '../../common/logger'

export default function requireAuthorizedUser(req, res, next) {
    if(!req.session.user) {
        l.warn(`Unauthorized access attempt to ${req.path}. This is expected if the user isn't authenticated, so don't panic unless you really weren't expecting to see this.`)
        res.status(401).json({ status: 401, message: 'Unauthorized'})
    }
    next();
}