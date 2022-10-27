/**
 * Gets cards using parameters. Default sorted by name descending. To ascend use -1.
 * @param {integer} records how much maps should be displayed at once
 * @param {string} name string to search for in name
 * @param {integer} page page from which records should be displayed
 * @param {MongoDB} mongoObject to search
 * @returns {object} with returned cards, count of pages and current page
 */
const filterAsset = async (records, name, page, mongoObject) => {
    let assets = [], returnedAssets = [], pages = 1
    assets = await mongoObject.find({ "name": { "$regex": name, "$options": "i" } }).sort({ "name": 1 })
    if (assets.length > records) {
        pages = Math.ceil(assets.length / records)
        if (page > pages) {
            assets.length = records
            returnedAssets = assets
            page = 1
        } else {
            if (page == 1) {
                assets.length = records
                returnedAssets = assets
            } else {
                if (page < pages) {
                    for (let i = 0; i < records; i++) {
                        returnedAssets.push(assets[i + (records * (page - 1))])
                    }
                } else {
                    for (let i = (page - 1) * records; i < assets.length; i++) {
                        returnedAssets.push(assets[i])
                    }
                }
            }
        }
    } else {
        returnedAssets = assets
        page = 1
    }
    return { assets: returnedAssets, pages: pages, page: page }
}

module.exports = { filterAsset }