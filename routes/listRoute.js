const express = require('express')
const { getLists } = require('../controller/listController')
const { UserAuthorize } = require('../middleware/auth')
const app = express.Router()


app.get('/:identifier/:page', UserAuthorize, async (req, res) => {
    const { identifier, page } = req.params
    const data = await getLists(identifier, page)
    res.json(data)
})

module.exports = app