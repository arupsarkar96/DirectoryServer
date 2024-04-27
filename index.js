const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const homeRoute = require('./routes/homeRoute')
const loginRoute = require('./routes/loginRoute')
const userRoute = require('./routes/userRoute')
const listRoute = require('./routes/listRoute')
const clubRoute = require('./routes/clubRoute')
const pageRoute = require('./routes/pageRoute')
const searchRoute = require('./routes/searchRoute')
const config = require('./config/config')


app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan(":remote-addr :method :url - :response-time ms [:status]"))
app.use('/login', loginRoute)
app.use('/home', homeRoute)
app.use('/user', userRoute)
app.use('/list', listRoute)
app.use('/club', clubRoute)
app.use('/page', pageRoute)
app.use('/search', searchRoute)


app.listen(config.port, '0.0.0.0', () => {
    console.log(`🚀 HTTP`, config.port)
})