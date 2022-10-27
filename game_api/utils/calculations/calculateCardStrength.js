/**
 * Calculates strength of card and returns it
 * @param {object} card to calculate strength
 * @param {number} quantity how much of this cards
 * @returns returns strength integer
 */
var calculateCardsStrength = (card, quantity) => {
    var strength = (card.type.length + card.attack + card.defense + card.mobility + card.effects.length + card.vision) * quantity
    return strength
}

module.exports = { calculateCardsStrength }