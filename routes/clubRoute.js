const express = require('express')
const { getClubLists } = require('../controller/listController')
const { UserAuthorize } = require('../middleware/auth')
const app = express.Router()


app.get('/:identifier/:page', UserAuthorize, async (req, res) => {
    const { identifier, page } = req.params
    const data = await getClubLists(identifier, page)
    res.json(data)
})

module.exports = app