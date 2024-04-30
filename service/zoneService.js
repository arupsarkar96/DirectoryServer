const { getConnection } = require("../config/db")

const getZoneService = async () => {
    const connection = await getConnection()
    const sql = 'SELECT Zones.zid, Zones.zone_name AS zone, COUNT(Clubs.zone_id) AS clubs, zc.name AS zcName, zc.image AS zcImage, zc.phone AS zcPhone, gst.name AS gstName, gst.image AS gstImage, gst.phone AS gstPhone, glt.name AS gltName, glt.image AS gltImage, glt.phone AS gltPhone, gmt.name AS gmtName, gmt.image AS gmtImage, gmt.phone AS gmtPhone FROM Zones LEFT JOIN Clubs ON Zones.zid = Clubs.zone_id LEFT JOIN Users AS zc ON Zones.ZC = zc.uid LEFT JOIN Users AS gst ON Zones.GST = gst.uid LEFT JOIN Users AS glt ON Zones.GLT = glt.uid LEFT JOIN Users AS gmt ON Zones.GMT = gmt.uid GROUP BY Zones.zid'
    const value = []
    const [result, fields] = await connection.query(sql, value)
    connection.release()
    return result
}

module.exports = { getZoneService }