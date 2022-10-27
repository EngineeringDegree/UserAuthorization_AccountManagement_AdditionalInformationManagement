/**
 * Chooses number from 0 to i - 1
 * @param {number} i array length
 * @returns number
 */
const selectRandomElementFromArray = (i) => {
    return Math.floor(Math.random() * i)
}

module.exports = { selectRandomElementFromArray }