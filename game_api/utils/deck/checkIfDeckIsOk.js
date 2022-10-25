const { Deck } = require('../../models/deck')
const { Card_Nation } = require('../../models/card_nation')
const { Card } = require('../../models/card')

/**
 * Checks if deck is okay
 * @param {string} id of deck
 * @returns true if okay, false if not
 */
var checkIfDeckOk = async (id) => {
    var deck = undefined, nation = undefined
    try {
        deck = await Deck.findOne({ _id: id, deleted: false })
    } catch (e) {
        return false
    }

    if (!deck) {
        return false
    }

    try {
        nation = await Card_Nation.findOne({ _id: deck.nation, readyToUse: true })
    } catch (e) {
        return false
    }

    if (!nation) {
        return false
    }

    for (let i = 0; i < deck.cards.length; i++) {
        var card = undefined
        try {
            card = await Card.findOne({ _id: deck.cards[i]._id, readyToUse: true })
        } catch (e) {
            return false
        }
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