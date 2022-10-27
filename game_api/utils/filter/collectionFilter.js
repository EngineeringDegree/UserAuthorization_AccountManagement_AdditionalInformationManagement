/**
 * Finds if element is in database and filters it
 * @param {array} els to filter and check
 * @param {Collection} Collection to check from
 * @returns filtered array
 */
const collectionFilter = async (els, Collection) => {
    let toReturn = []
    for (let i = 0; i < els.length; i++) {
        let el = undefined
        try {
            el = await Collection.findOne({ _id: els[i] })
        } catch (e) { }
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