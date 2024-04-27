const { getConnection } = require("../config/db")


const getMenus = async () => {
    const sql = 'SELECT * FROM `Menus`; SELECT * FROM `Banners` ORDER BY `sequence` DESC; SELECT * FROM `Messages` ORDER BY `sequence` DESC'
    const connection = await getConnection()
    const [result, fields] = await connection.query(sql, [])
    connection.release()
    return result
}


module.exports = { getMenus }