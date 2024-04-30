const express = require('express')
const { UserAuthorize } = require('../middleware/auth')
const { getUserSearch } = require('../controller/userController')
const app = express.Router()


app.get('/:identifier', UserAuthorize, async (req, res) => {
    const { identifier } = req.params

    const data = await getUserSearch(identifier)

    res.json(data)
})


module.exports = app