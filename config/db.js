const mysql = require('mysql2/promise')
const util = require('util');
const config = require('./config');

const pool = mysql.createPool({

    multipleStatements: true,
    uri: config.db
})

const getConnection = async () => {
    const connection = await pool.getConnection();

    // Promisify specific methods of the connection object
    connection.queryAsync = util.promisify(connection.query).bind(connection);
    connection.executeAsync = util.promisify(connection.execute).bind(connection);
    // Add more methods as needed

    // Add a release method to release the connection back to the pool
    connection.releaseConnection = () => {
        connection.release();
    };

    return connection;
};

module.exports = { getConnection }