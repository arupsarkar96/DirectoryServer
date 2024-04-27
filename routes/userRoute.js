const express = require('express')
const app = express.Router()
const { getUserList } = require('../controller/userController')
const { UserAuthorize } = require('../middleware/auth')



app.get('/:identifier/:page', UserAuthorize, async (req, res) => {
    const { identifier, page } = req.params

    const data = await getUserList(identifier, page)

    res.json(data)
})


module.exports = app