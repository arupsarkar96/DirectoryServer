const admin = require('firebase-admin')
const jwt = require('jsonwebtoken')
const { getUserByPhone } = require('../service/userService')
const config = require('../config/config')

const serviceAccount = require('../key.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

const loginUser = async (phone) => {
    let users = await getUserByPhone(phone)

    if (users.length > 0) {
        return {
            isUser: true,
            message: jwt.sign({ user: phone }, config.jwtSecret, { expiresIn: '5min' })
        }
    } else {
        return {
            isUser: false,
            message: "Not found !"
        }
    }
}

const verifyUser = async (token) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(token)
        return {
            isUser: true,
            message: jwt.sign({ user: decodedToken.phone_number }, config.jwtSecret, { expiresIn: '1y' })
        }
    } catch (error) {
        return {
            isUser: false,
            message: "Not found !"
        }
    }
}


module.exports = { loginUser, verifyUser }