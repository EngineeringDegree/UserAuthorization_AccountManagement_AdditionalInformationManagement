/**
 * Check if user has card
 * @param {Card} card object model
 * @param {array} userCards object model
 * @returns if user has card
 */
var checkIfUserHasCard = (card, userCards) => {
    for (let i = 0; i < userCards.cards.length; i++) {
        if (card._id.equals(userCards.cards[i]._id)) {
            return true
        }
    }
    return false
}

module.exports = { checkIfUserHasCard }