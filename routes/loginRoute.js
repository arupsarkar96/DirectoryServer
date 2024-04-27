const express = require('express')
const { loginUser, verifyUser } = require('../controller/loginController')
const app = express.Router()




app.get('/:phone', async (req, res) => {
    let phone = req.params.phone
    let user = await loginUser(phone)
    res.status(200).json(user)
})

app.post('/', async (req, res) => {
    let { token } = req.body
    let d = await verifyUser(token)
    res.status(200).json(d)
})



module.exports = app