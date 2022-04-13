import l from '../../common/logger'

export default function requireAuthorizedUser(req, res, next) {
    if(!req.session.user) {
        l.warn(`Unauthorized access attempt to ${req.path}`)
        res.status(401).json({ status: 401, message: 'Unauthorized'})
    }
    next();
}