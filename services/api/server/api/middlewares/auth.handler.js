import l from '../../common/logger'

export function requireAuthorizedUser(req, res, next) {
    if(!req.session.user) {
        l.warn(`Unauthorized access attempt to ${req.path}. This is expected if the user isn't authenticated, so don't panic unless you really weren't expecting to see this.`)
        res.status(401).json({ status: 401, message: 'Unauthorized'})
    } else {
        next();
    }
}

export function requireBetaAccessAuthorized(req, res, next) {
    if(!req.session.user || !req.session.user.beta_authorized) {
        res.status(401).json({ status: 401, message: 'Unauthorized'})
    } else {
        next()
    }
}

export function requireEulaAccepted(req, res, next) {
    if(!req.session.user || !req.session.user.eula_accepted) {
        res.status(401).json({ status: 401, message: 'Unauthorized'})
    } else {
        next()
    }
}