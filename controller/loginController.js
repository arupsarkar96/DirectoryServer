const jwt = require('jsonwebtoken')
const axios = require('axios')
const { getUserByPhone } = require('../service/userService')
const config = require('../config/config')

const otps = {}

const loginUser = async (phone) => {
    let users = await getUserByPhone(phone)

    if (users.length > 0) {
        sendOtp(phone)
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

const sendOtp = (phone) => {
    let code = Math.floor(1000 + Math.random() * 9000)

    let url = `https://www.fast2sms.com/dev/bulkV2?authorization=prtxTZayeQoIiLcBYFz7MlKHgG5qhwUb213N9PvDEjAJRCmnk03iordn4vUEc0p1OHP8xG2DbBaLJVFf&route=otp&variables_values=${code}&flash=0&numbers=${phone}`

    otps[phone] = code

    console.log('GENERATED OTP : ' + phone, code)

    axios.get(url)
        .then(response => {
            console.log('Response:', response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function searchOtp(phone) {
    // Check if the key exists in the array
    if (phone in otps) {
        // Return the value corresponding to the key
        return otps[phone];
    } else {
        // Return null if the key is not found
        return null;
    }
}



const verifyUser = async (phone, otp) => {

    let otpInDb = searchOtp(phone)

    if (otpInDb != null && otpInDb == otp) {
        console.log('OTP VERIFIED')
        return {
            isUser: true,
            message: jwt.sign({ user: phone }, config.jwtSecret, { expiresIn: '1y' })
        }
    } else {
        console.log('OTP NOT VERIFIED')
        return {
            isUser: false,
            message: "OTP doesn't match !"
        }
    }
}


module.exports = { loginUser, verifyUser }