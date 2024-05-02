const express = require('express')
const { getAdminBanners } = require('../service/adminService')
const app = express.Router()


app.get('/banners', async (req, res) => {
    let data = await getAdminBanners()
    res.json(data)
})


module.exports = app