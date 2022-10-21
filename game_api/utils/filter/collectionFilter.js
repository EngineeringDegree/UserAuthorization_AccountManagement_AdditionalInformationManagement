/**
 * Finds if element is in database and filters it
 * @param {array} els to filter and check
 * @param {Collection} Collection to check from
 * @returns filtered array
 */
var collectionFilter = async (els, Collection) => {
    var toReturn = []
    for (let i = 0; i < els.length; i++) {
        var el = await Collection.findOne({ _id: els[i] })
        if (el) {
            if (el.name != 'All') {
                toReturn.push(els[i])
            } else {
                toReturn.unshift(els[i])
            }
        }
    }

    return toReturn
}

module.exports = { collectionFilter }