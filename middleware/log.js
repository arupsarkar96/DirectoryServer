const config = require('../config/config')
const { createLogger } = require("winston")
const LokiTransport = require("winston-loki")
const client = require('prom-client')
const collectDefaultMetrics = client.collectDefaultMetrics
collectDefaultMetrics({ register: client.register })

const options = {
    job: "log",
    transports: [
        new LokiTransport({
            host: config.LOKI_URL
        })
    ]
}

const totalReqCounter = new client.Counter({
    name: "total_req",
    help: "Total request served by this server"
})

// const expressHistogram = new client.Histogram({
//     name: "http_express_req_res_time",
//     help: "Request Response time",
//     labelNames: ["METHOD", "ROUTE", "STATUS"],
//     buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000]
// })



const logger = createLogger(options)


const LogRequest = async (req, res, next) => {
    const startTime = process.hrtime()

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress

    if (req.url != "/metrics") {
        totalReqCounter.inc()
    }

    // expressHistogram.labels({
    //     METHOD: req.method,
    //     ROUTE: req.url,
    //     STATUS: res.statusCode
    // })
    function logResponse() {

        if (req.url != "/metrics") {

            const statusCode = res.statusCode;
            const endTime = process.hrtime(startTime)
            const responseTime = endTime[0] * 1000 + endTime[1] / 1000000

            if (statusCode == 200) {
                logger.info(`${ip} - [${req.method}] - ${req.protocol}//${req.hostname}${req.originalUrl} - ${statusCode} - ${responseTime.toFixed(2)}ms`)
            } else {
                logger.error(`${ip} - [${req.method}] - ${req.protocol}//${req.hostname}${req.originalUrl} - ${statusCode} - ${responseTime.toFixed(2)}ms`)
            }
        }
        //totalReqCounter.remove()
    }
    res.on('finish', logResponse)

    next()
}

module.exports = { LogRequest }