const { getListService, getClubListService, getPageService } = require("../service/listService")



const getLists = async (identifier, page) => {
    const limit = 10
    const offset = limit * page

    const data = await getListService(identifier, limit, offset)

    return {
        pages: parseInt(data[0][0].count / limit),
        list: data[1]
    }
}

const getClubLists = async (identifier, page) => {
    const limit = 10
    const offset = limit * page

    const data = await getClubListService(identifier, limit, offset)

    return {
        pages: parseInt(data[0][0].count / limit),
        list: data[1]
    }
}

const getPage = async (identifier) => {
    return await getPageService(identifier)
}

module.exports = { getLists, getClubLists, getPage }