const { getConnection } = require("../config/db")


const getAdminBanners = async () => {
    const connection = await getConnection()
    const sql = "SELECT * FROM Banners"

    const [result, fields] = await connection.query(sql, [])
    connection.release()
    return result
}

module.exports = { getAdminBanners }