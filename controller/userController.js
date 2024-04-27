const { getUserListService, getUserSearchService } = require("../service/userService")


const getUserList = async (identifier, page) => {
    const limit = 10
    const offset = limit * page

    const data = await getUserListService(identifier, limit, offset)

    return {
        pages: parseInt(data[0][0].count / limit),
        users: data[1]
    }
}

const getUserSearch = async (identifier) => {

    return await getUserSearchService(identifier)
}


module.exports = { getUserList, getUserSearch }