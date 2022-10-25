const express = require('express')
const router = express.Router()
var { UserCard } = require('../../../models/user_cards')
var { Card_Nation } = require('../../../models/card_nation')
var { Card } = require('../../../models/card')

router.get('/', async (req, res) => {
    if (res.locals.user.data) {
        var cardsObj = await UserCard.findOne({ owner: req.query.email })
        if (cardsObj) {
            var cards = cardsObj.cards
            var cardsFiltered = []
            for (let i = 0; i < cards.length; i++) {
                var card = undefined
                try {
                    card = await Card.findOne({ _id: cards[i]._id })
                } catch (e) { }
                if (card) {
                    var nations = []
                    var nationsReady = []
                    for (let j = 0; j < card.nation.length; j++) {
                        var nation = undefined
                        try {
                            nation = await Card_Nation.findOne({ _id: card.nation, readyToUse: true })
                        } catch (e) { }
                        if (nation) {
                            let nameFound = false
                            for (let k = 0; k < nations.length; k++) {
                                if (nations[k] == nation.name) {
                                    nameFound = true
                                    break
                                }
                            }

                            if (!nameFound) {
                                nations.push(nation.name)
                                nationsReady.push(nation.readyToUse)
                            }
                        }
                    }
                    cardsFiltered.push({ card: card, quantity: cards[i].quantity, nations: nations, nationsReady: nationsReady })
                }
            }

            return res.status(200).send({ status: 'OK', code: 200, cards: cardsFiltered, token: res.locals.user.data.token })
        }

        return res.status(404).send({ status: 'CARDS NOT FOUND', code: 404, action: 'CARDS NOT FOUND POPUP' })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

module.exports = router