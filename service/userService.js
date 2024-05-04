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

    if (identifier == 'MEMBER' || identifier == 'COMMITTEE') {
        const sql = 'SELECT COUNT(*) AS count FROM `Users` WHERE `role` = ?; SELECT `Users`.*, `Clubs`.`club_name` AS club FROM `Users` LEFT JOIN `Clubs` ON `Users`.`club_id` = `Clubs`.`cid` WHERE `Users`.`role` = ? ORDER BY `Users`.`name` ASC LIMIT ? OFFSET ?;'
        const value = [identifier, identifier, limit, offset]

        const [result, fields] = await connection.query(sql, value)
        connection.release()
        return result
    } else if (identifier == 'PST') {
        const sql = 'SELECT COUNT(*) AS count FROM `Users` WHERE `role` = ?; SELECT `Users`.*, `Clubs`.`club_name` AS club FROM `Users` LEFT JOIN `Clubs` ON `Users`.`club_id` = `Clubs`.`cid` WHERE `Users`.`role` = ? ORDER BY `Users`.`club_id` ASC, CASE WHEN `Users`.`designation` = "PRESIDENT" THEN 1 WHEN `Users`.`designation` = "SECRETARY" THEN 2 WHEN `Users`.`designation` = "TREASURER" THEN 3 ELSE 4 END LIMIT ? OFFSET ?;'
        const value = [identifier, identifier, limit, offset]

        const [result, fields] = await connection.query(sql, value)
        connection.release()
        return result
    } else if (identifier == 'CABINET') {
        const sql = 'SELECT COUNT(*) AS count FROM `Users` WHERE `role` = ?; SELECT `Users`.*, `Clubs`.`club_name` AS club FROM `Users` LEFT JOIN `Clubs` ON `Users`.`club_id` = `Clubs`.`cid` WHERE `Users`.`role` = ? ORDER BY `Users`.`cabinet_order` ASC LIMIT ? OFFSET ?;'
        const value = [identifier, identifier, limit, offset]

        const [result, fields] = await connection.query(sql, value)
        connection.release()
        return result
    } else if (identifier == 'PDG') {
        const sql = 'SELECT COUNT(*) AS count FROM `Users` WHERE `role` = ?; SELECT `Users`.*, `Clubs`.`club_name` AS club FROM `Users` LEFT JOIN `Clubs` ON `Users`.`club_id` = `Clubs`.`cid` WHERE `Users`.`role` = ? AND SUBSTRING(`Users`.`year_end`, 1, 4) < YEAR(CURRENT_DATE)ORDER BY `Users`.`year_end` DESC LIMIT ? OFFSET ?;'
        const value = [identifier, identifier, limit, offset]

        const [result, fields] = await connection.query(sql, value)
        connection.release()
        return result
    } else {
        const sql = 'SELECT COUNT(*) AS count FROM `Users` WHERE `club_id` = ?; SELECT `Users`.*, `Clubs`.`club_name` AS club FROM `Users` LEFT JOIN `Clubs` ON `Users`.`club_id` = `Clubs`.`cid` WHERE `Users`.`club_id` = ? ORDER BY CASE WHEN `Users`.`designation` = "PRESIDENT" THEN 1 WHEN `Users`.`designation` = "SECRETARY" THEN 2 WHEN `Users`.`designation` = "TREASURER" THEN 3 WHEN `Users`.`role` = "CABINET" THEN 4 ELSE 5 END, CASE WHEN `Users`.`role` = "MEMBER" THEN Users.name END ASC LIMIT ? OFFSET ?;'
        const value = [identifier, identifier, limit, offset]

        const [result, fields] = await connection.query(sql, value)
        connection.release()
        return result
    }
}

const getUserSearchService = async (identifier, filter) => {


    if (filter == "ALL") {
        const connection = await getConnection()

        const sql = 'SELECT Users.*, Clubs.club_name as club FROM `Users` LEFT JOIN `Clubs` ON `Users`.`club_id` = `Clubs`.`cid` WHERE `name` LIKE ? ORDER BY `name` ASC LIMIT 20'
        const value = [`%${identifier}%`]

        const [result, fields] = await connection.query(sql, value)
        connection.release()
        return result
    } else {
        const connection = await getConnection()

        const sql = 'SELECT Users.*, Clubs.club_name as club FROM `Users` LEFT JOIN `Clubs` ON `Users`.`club_id` = `Clubs`.`cid` WHERE `Users`.`name` LIKE ? AND `Users`.`role` = ? ORDER BY `name` ASC LIMIT 20'
        const value = [`%${identifier}%`, filter]

        const [result, fields] = await connection.query(sql, value)
        connection.release()
        return result
    }
}

const updateUserImageService = async (image, phone) => {
    const connection = await getConnection()
    const sql = 'UPDATE Users SET image = ? WHERE phone = ?'
    const value = [image, phone]
    const [result, fields] = await connection.query(sql, value)
    connection.release()
    return result
}

module.exports = { getUserByPhone, getUserListService, getUserSearchService, updateUserImageService }