const express = require('express')
const { getZoneService } = require('../service/zoneService')
const app = express.Router()


app.get('/', async (req, res) => {
    const zone = await getZoneService()
    res.status(200).json({ zones: zone })
})

module.exports = app