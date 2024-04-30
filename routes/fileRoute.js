const multer = require('multer')
const Minio = require('minio')
const { v4: uuid } = require('uuid')
const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache TTL: 5 minutes

const minioClient = new Minio.Client({
    endPoint: process.env.S3_ENDPOINT,
    port: 9000,
    useSSL: false,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
})


const storage = multer.memoryStorage({})
const upload = multer({ storage: storage })


const express = require('express')
const { UserAuthorize } = require('../middleware/auth')
const { updateUserImageService } = require('../service/userService')
const app = express.Router()







app.get('/:key', UserAuthorize, async (req, res) => {
    let id = req.params.key

    const stat = await minioClient.statObject('avatars', id)
    if (stat.err) {
        return res.sendStatus(404)
    }


    // Stream the object data to the response
    const dataStream = await minioClient.getObject('avatars', id)
    const chunks = []

    dataStream.on('data', (chunk) => {
        chunks.push(chunk)
    })

    dataStream.on('end', () => {
        const imageData = Buffer.concat(chunks).toString('base64')
        const finalImage = Buffer.from(imageData, 'base64')
        res.setHeader('Content-Type', 'application/octet-stream')
            .status(200)
            .send(finalImage)
    })
})












app.post('/', UserAuthorize, upload.single("file"), async (req, res) => {
    const file = req.file
    if (!file) {
        return res.status(400).send('No file uploaded.')
    }
    const fileName = uuid()

    minioClient.putObject('avatars', fileName, file.buffer, (err, etag) => {
        if (err) {
            console.error(err)
            // Release from Memory Storage
            req.file = null
            return res.status(500).send('Error uploading file to Minio.')
        }
        const uploadedImageUrl = "https://directory.messant.in/file/" + fileName

        res.send(uploadedImageUrl)

        updateUserImageService(uploadedImageUrl, req.headers['x-auth-user'])
        // Release from Memory Storage
        req.file = null
    })
})

module.exports = app