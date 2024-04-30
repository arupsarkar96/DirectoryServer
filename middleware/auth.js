const jwt = require('jsonwebtoken')
const config = require('../config/config')



const UserAuthorize = async (req, res, next) => {
    let { authorization } = req.headers
    if (!authorization) {
        res.sendStatus(401)
        return
    }

    try {
        let a = jwt.verify(authorization, config.jwtSecret)
        req.headers['x-auth-user'] = a.user
        next()
    } catch (err) {
        res.sendStatus(401)
        return false
    }
}

module.exports = { UserAuthorize }