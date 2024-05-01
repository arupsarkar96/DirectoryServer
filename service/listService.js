const { getConnection } = require("../config/db")


const getListService = async (identifier, limit, offset) => {


    if (identifier == "PID") {
        const connection = await getConnection()

        const sql = 'SELECT COUNT(*) AS count FROM `List` WHERE `identifier` = ?; SELECT * FROM `List` WHERE `identifier` = ? ORDER BY `timestamp` DESC LIMIT ? OFFSET ?;'
        const value = [identifier, identifier, limit, offset]

        const [result, fields] = await connection.query(sql, value)
        connection.release()
        return result
    } else {
        const connection = await getConnection()

        const sql = 'SELECT COUNT(*) AS count FROM `List` WHERE `identifier` = ?; SELECT * FROM `List` WHERE `identifier` = ? ORDER BY `sequence` ASC LIMIT ? OFFSET ?;'
        const value = [identifier, identifier, limit, offset]

        const [result, fields] = await connection.query(sql, value)
        connection.release()
        return result
    }
}

const getClubListService = async (identifier, limit, offset) => {
    const connection = await getConnection()

    const sql = 'SELECT COUNT(*) AS count FROM `Clubs` WHERE `zone_id` = ?; SELECT * FROM `Clubs` WHERE `zone_id` = ? ORDER BY `cid` ASC LIMIT ? OFFSET ?;'
    const value = [identifier, identifier, limit, offset]

    const [result, fields] = await connection.query(sql, value)
    connection.release()
    return result

}

const getPageService = async (identifier) => {
    const connection = await getConnection()

    const sql = 'SELECT * FROM `Pages` WHERE `identifier` = ?'
    const value = [identifier]

    const [result, fields] = await connection.query(sql, value)
    connection.release()
    return result[0]
}


module.exports = { getListService, getClubListService, getPageService }