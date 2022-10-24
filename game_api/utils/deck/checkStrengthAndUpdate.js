const { Deck } = require('../../models/deck')
const { Card } = require('../../models/card')

/**
 * Finds deck in database and updates strength if necesarry
 * @param {DeckID} id to find in db 
 * @retunrs strength
 */
var checkDeckStrengthAndUpdate = async (id) => {
    var strength = 0
    var deck = await Deck.findOne({ _id: id })
    if (deck) {
        for (let i = 0; i < deck.cards.length; i++) {
            var card = await Card.findOne({ _id: deck.cards[i]._id })
            if (card) {
                strength += ((card.type.length + card.attack + card.defense + card.mobility + card.effects.length) * deck.cards[i].quantity)
            }
        }

        if (strength != deck.strength) {
            const filter = {
                _id: deck._id
            }
            const update = {
                strength: strength
            }

            await Deck.updateOne(filter, update)
        }
    }

    return strength
}

module.exports = { checkDeckStrengthAndUpdate }