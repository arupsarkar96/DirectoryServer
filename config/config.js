const config = {
    port: 8080,
    jwtSecret: 'jytBTKqyY2AUH4S1JY460l4zAbtDbwTg',
    db: process.env.MYSQL || 'mysql://root:Aspire_5742@192.168.1.102/directory',
    LOKI_URL: "http://192.168.1.102:3100"
}

module.exports = config