const { Deck } = require('../../models/deck')
const { Card } = require('../../models/card')
const { calculateCardsStrength } = require('../calculations/calculateCardStrength')
/**
 * Finds deck in database and updates strength if necesarry
 * @param {DeckID} id to find in db 
 * @retunrs strength
 */
var checkDeckStrengthAndUpdate = async (id) => {
    var strength = 0
    var deck = undefined
    try {
        deck = await Deck.findOne({ _id: id })
    } catch (e) { }
    if (deck) {
        for (let i = 0; i < deck.cards.length; i++) {
            var card = undefined
            try {
                card = await Card.findOne({ _id: deck.cards[i]._id })
            } catch (e) { }
            if (card) {
                strength += calculateCardsStrength(card, deck.cards[i].quantity)
            }
        }

        if (strength != deck.strength) {
            const filter = {
                _id: deck._id
            }
            const update = {
                strength: strength
            }
            try {
                await Deck.updateOne(filter, update)
            } catch (e) { }
        }
    }

    return strength
}

module.exports = { checkDeckStrengthAndUpdate }