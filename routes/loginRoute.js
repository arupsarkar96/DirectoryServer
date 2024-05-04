const express = require('express')
const { loginUser, verifyUser } = require('../controller/loginController')
const { UserAuthorize } = require('../middleware/auth')
const app = express.Router()




app.get('/:phone', async (req, res) => {
    let phone = req.params.phone
    let user = await loginUser(phone)
    res.status(200).json(user)
})

app.post('/', UserAuthorize, async (req, res) => {
    let { otp } = req.body
    let phone = req.headers['x-auth-user']
    let d = await verifyUser(phone, otp)
    res.status(200).json(d)
})



module.exports = app