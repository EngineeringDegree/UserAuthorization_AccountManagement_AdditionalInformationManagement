const { Map_Field } = require('../../models/map_field')

/**
 * Checks if fields are okay to use and exist in database (even one that's are currently offline)
 * @param {array} fields of map
 * @param {string} dimensions of map
 * @returns if fields are okay
 */
const checkIfFieldsAreOkay = async (fields, dimensions) => {
    let dims = dimensions.split('x')
    if (dims.length != 2) {
        if (dims.length != 1) {
            return false
        }
    }

    if (dims.length == 1) {
        dims.push(dims[0])
    }

    dims[0] /= 1
    dims[1] /= 1

    if (fields.length != dims[1]) {
        return false
    }
    for (let i = 0; i < fields.length; i++) {
        if (fields[i].length != dims[0]) {
            return false
        }
    }

    for (let i = 0; i < dims[1]; i++) {
        for (let j = 0; j < dims[0]; j++) {
            let field = undefined
            try {
                field = await Map_Field.findOne({ _id: fields[i][j] })
            } catch (e) {
                return false
            }
            if (!field) {
                return false
            }
        }
    }
    return true
}

/**
 * Cehcks if starting positions on the map are okay
 * @param {array} positions to start game 
 * @param {string} dimensions of map 
 * @returns if starting positions are okay
 */
const checkIfStartingPositionsAreOkay = (positions, dimensions) => {
    let dims = dimensions.split('x')
    if (dims.length != 2) {
        if (dims.length != 1) {
            return false
        }
    }

    if (dims.length == 1) {
        dims.push(dims[0])
    }

    dims[0] /= 1
    dims[1] /= 1

    for (let i = 0; i < positions.length; i++) {
        let pos = positions[i].split('-')
        if (!pos[1] || !pos[2]) {
            return false
        }

        if (pos[1] / 1 >= dims[0] / 1 || pos[2] / 1 >= dims[1] / 1) {
            return false
        }
    }

    return true
}

module.exports = { checkIfFieldsAreOkay, checkIfStartingPositionsAreOkay }