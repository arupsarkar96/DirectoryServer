const express = require('express')
const { getHome } = require('../service/homeService')
const { UserAuthorize } = require('../middleware/auth')
const app = express.Router()


app.get('/', UserAuthorize, async (req, res) => {
    let user = req.headers['x-auth-user']
    let home = await getHome(user)
    res.status(200).json({ menus: home[0], banners: home[1], messages: home[2], user: home[3][0] })
})


module.exports = app