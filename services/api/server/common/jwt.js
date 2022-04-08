import jwt from 'jsonwebtoken';
import l from './logger';
import db from '../db'
// function for generating JWTs
export function generateAccessToken(user) {
    return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '86400s'})
}

// middleware for protecting routes 
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null) return res.sendStatus(401)
    
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
        if(err) {
            l.error(`Auth error: ${err}`)
            return res.sendStatus(403)
        }

        req.user = await db('users').select({ id: user.id })

        next()
    })
}