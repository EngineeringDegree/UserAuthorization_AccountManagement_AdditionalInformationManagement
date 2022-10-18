const express = require('express')
const router = express.Router()
var { UserCard } = require('../../../models/user_cards')
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
                    cardsFiltered.push({ card: card, quantity: cards[i].quantity })
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