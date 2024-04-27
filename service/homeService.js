const { getConnection } = require("../config/db")


const getHome = async (user) => {
    const sql = 'SELECT * FROM `Menus` ORDER BY `sequence` DESC; SELECT * FROM `Banners` ORDER BY `sequence` DESC; SELECT * FROM `Messages` ORDER BY `sequence` DESC; SELECT Users.uid, Users.name, Users.image, Users.mobile, Users.email, Users.designation, Users.role, Clubs.club_name AS club FROM `Users` LEFT JOIN Clubs ON Users.club_id = Clubs.club_id WHERE Users.phone = ?'
    const connection = await getConnection()
    const [result, fields] = await connection.query(sql, [user])
    connection.release()
    return result
}

module.exports = { getHome }