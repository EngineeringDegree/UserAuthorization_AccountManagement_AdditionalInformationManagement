/**
 * Chooses number from 0 to i - 1
 * @param {number} i array length
 * @returns number
 */
var selectRandomElementFromArray = (i) => {
    return Math.floor(Math.random() * i)
}

module.exports = { selectRandomElementFromArray }