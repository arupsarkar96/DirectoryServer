const express = require('express')
const { getPage } = require('../controller/listController')
const app = express.Router()



app.get('/:identifier', async (req, res) => {
    const { identifier } = req.params
    const data = await getPage(identifier)
    res.json(data)
})

module.exports = app