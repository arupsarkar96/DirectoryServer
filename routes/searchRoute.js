const express = require('express')
const { UserAuthorize } = require('../middleware/auth')
const { getUserSearch } = require('../controller/userController')
const app = express.Router()


app.get('/:filter/:identifier', UserAuthorize, async (req, res) => {
    const { identifier, filter } = req.params

    const data = await getUserSearch(identifier, filter)

    res.json(data)
})


module.exports = app