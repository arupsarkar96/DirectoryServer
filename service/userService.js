const { getConnection } = require("../config/db")


const getUserByPhone = async (phone) => {
    const connection = await getConnection()
    const sql = 'SELECT * FROM `Users` WHERE `mobile` = ? ORDER BY `uid` ASC LIMIT 1'
    const value = [phone]
    const [result, fields] = await connection.query(sql, value)
    connection.release()
    return result
}


const getUserListService = async (identifier, limit, offset) => {
    const connection = await getConnection()

    const sql = 'SELECT COUNT(*) AS count FROM `Users` WHERE `role` = ?; SELECT `Users`.*, `Clubs`.`club_name` AS club FROM `Users` LEFT JOIN `Clubs` ON `Users`.`club_id` = `Clubs`.`club_id` WHERE `Users`.`role` = ? ORDER BY `Users`.`uid` ASC LIMIT ? OFFSET ?;'
    const value = [identifier, identifier, limit, offset]

    const [result, fields] = await connection.query(sql, value)
    connection.release()
    return result

}

const getUserSearchService = async (identifier) => {
    const connection = await getConnection()

    const sql = 'SELECT * FROM `Users` LEFT JOIN `Clubs` ON `Users`.`club_id` = `Clubs`.`club_id` WHERE `name` LIKE ? ORDER BY `name` ASC LIMIT 20'
    const value = [`${identifier}%`]

    const [result, fields] = await connection.query(sql, value)
    connection.release()
    return result

}


module.exports = { getUserByPhone, getUserListService, getUserSearchService }