/**
 * Check if user has card
 * @param {Card} card object model
 * @param {array} userCards object model
 * @param {number} quantity of card
 * @returns if user has card
 */
const checkIfUserHasCard = (card, userCards, quantity) => {
    for (let i = 0; i < userCards.cards.length; i++) {
        if (card._id.equals(userCards.cards[i]._id)) {
            if (userCards.cards[i].quantity < quantity) {
                return false
            }
            return true
        }
    }
    return false
}

module.exports = { checkIfUserHasCard }