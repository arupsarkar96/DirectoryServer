const config = {
    port: 8080,
    jwtSecret: 'jytBTKqyY2AUH4S1JY460l4zAbtDbwTg',
    db: process.env.MYSQL || 'mysql://directory:Directory123@192.168.1.101/directory',
    LOKI_URL: process.env.LOKI || "http://192.168.1.102:3100",
    S3_ENDPOINT: process.env.S3_ENDPOINT || "192.168.1.100",
    S3_BUCKET: process.env.S3_BUCKET || "directory",
    S3_ACCESS_KEY: process.env.S3_ACCESS_KEY || "cFVms9i7n1weyt60gkZc",
    S3_SECRET_KEY: process.env.S3_SECRET_KEY || "xn8U6ABr20u90cfBnO5GIrv90IWcXe7fe0fyc7zt"
}

module.exports = config