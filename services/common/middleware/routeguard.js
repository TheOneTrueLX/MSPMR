import { StatusCodes, ReasonPhrases } from 'http-status-codes'

/*
Usage Examples:

1. apply middleware to an entire controller:

    const router = new express.Router()
    router.use(middlewareName)
    router.get(...)

2. apply middleware to a single route:

    const router = new express.Router()
    router.get('/path', middlewareName, (req, res) => {...})

*/

export function requireAuthentication(req, res, next) {
    if(!(req.session && req.session.user)) {
        res.status(StatusCodes.UNAUTHORIZED).json({ status: StatusCodes.UNAUTHORIZED, message: ReasonPhrases.UNAUTHORIZED }).end()
    } else {
        next()
    }
}