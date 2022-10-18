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
                var card = await Card.findOne({ _id: cards[i]._id, readyToUse: true })
                if (card) {
                    var nations = []
                    for (let j = 0; j < card.nation.length; j++) {
                        var nation = await Card_Nation.findOne({ _id: card.nation, readyToUse: true })
                        if (nation) {
                            nations.push(nation.name)
                        }
                    }
                    cardsFiltered.push({ card: card, quantity: cards[i].quantity, nations: nations })
                }
            }

            if (res.locals.user.data.token) {
                return res.status(200).send({ status: 'OK', code: 200, cards: cardsFiltered, token: res.locals.user.data.token })
            }

            return res.status(200).send({ status: 'OK', code: 200, cards: cardsFiltered })
        }

        return res.status(404).send({ status: 'CARDS NOT FOUND', code: 404, action: 'CARDS NOT FOUND POPUP' })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

module.exports = router