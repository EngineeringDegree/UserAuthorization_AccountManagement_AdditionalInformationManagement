const { Deck } = require('../../models/deck')
const { Card_Nation } = require('../../models/card_nation')
const { Card } = require('../../models/card')

/**
 * Checks if deck is okay
 * @param {string} id of deck
 * @returns true if okay, false if not
 */
var checkIfDeckOk = async (id) => {
    var deck = await Deck.findOne({ _id: id, deleted: false })
    if (!deck) {
        return false
    }
    var nation = await Card_Nation.findOne({ _id: deck.nation, readyToUse: true })
    if (!nation) {
        return false
    }

    for (let i = 0; i < deck.cards.length; i++) {
        let card = await Card.findOne({ _id: deck.cards[i]._id, readyToUse: true })
        if (!card) {
            return false
        }

        if (!card.nation.includes(deck.nation)) {
            return false
        }
    }
    return true
}

module.exports = { checkIfDeckOk }