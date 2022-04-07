import jwt from 'jsonwebtoken';
import l from './logger';
import models from '../db'

// function for generating JWTs
export function generateAccessToken(twitch_userid) {
    return jwt.sign(twitch_userid, process.env.TOKEN_SECRET, { expiresIn: '86400s'})
}

// middleware for protecting routes 
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) return res.sendStatus(401)
    
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, twitch_clientid) => {
        if(err) {
            l.error(`Auth error: ${err}`)
            return res.sendStatus(403)
        }

        req.user = await models.User.findOne({ where: { twitch_clientid: twitch_clientid }})

        next()
    })
}