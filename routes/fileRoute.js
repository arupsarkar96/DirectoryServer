const express = require('express')
const { UserAuthorize } = require('../middleware/auth')
const { updateUserImageService } = require('../service/userService');
const config = require('../config/config');
const app = express.Router()
const multer = require('multer')
const Minio = require('minio')
const { v4: uuid } = require('uuid')
const NodeCache = require('node-cache')
const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache TTL: 5 minutes

const minioClient = new Minio.Client({
    endPoint: config.S3_ENDPOINT,
    useSSL: true,
    accessKey: config.S3_ACCESS_KEY,
    secretKey: config.S3_SECRET_KEY,
})

const bucket = config.S3_BUCKET

const storage = multer.memoryStorage({})
const upload = multer({ storage: storage })










app.get('/:key', async (req, res) => {
    let id = req.params.key


    const cachedImage = cache.get(id)

    if (cachedImage) {
        return res.set('Content-Type', 'image/jpeg').send(cachedImage)
    }

    const stat = await minioClient.statObject(bucket, id)
    if (stat.err) {
        return res.sendStatus(404)
    }


    // Stream the object data to the response
    const dataStream = await minioClient.getObject(bucket, id)
    const chunks = []

    dataStream.on('data', (chunk) => {
        chunks.push(chunk)
    })

    dataStream.on('end', () => {
        const imageData = Buffer.concat(chunks).toString('base64')
        const finalImage = Buffer.from(imageData, 'base64')
        cache.set(id, finalImage)
        res.setHeader('Content-Type', 'image/jpeg')
            .status(200)
            .send(finalImage)
    })
})












app.post('/', UserAuthorize, upload.single("file"), async (req, res) => {
    const file = req.file
    if (!file) {
        return res.status(400).send('No file uploaded.')
    }
    const fileName = uuid() + ".jpeg"

    minioClient.putObject(bucket, fileName, file.buffer, (err, etag) => {
        if (err) {
            console.error(err)
            // Release from Memory Storage
            req.file = null
            return res.status(500).send('Error uploading file to Minio.')
        }
        const uploadedImageUrl = "https://directory.messant.in/api/file/" + fileName

        res.send({ file: uploadedImageUrl })

        updateUserImageService(uploadedImageUrl, req.headers['x-auth-user'])
        // Release from Memory Storage
        req.file = null
    })
})

module.exports = app