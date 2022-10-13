const express = require('express')
const router = express.Router()
const Joi = require('joi')
const axios = require('axios')
const { Deck } = require('../../../models/deck')
const { Card } = require('../../../models/card')
const { UserCard } = require('../../../models/user_cards')
const { checkIfUserHasCard } = require('../../../utils/deck/checkIfUserHasCard')
const { maxCountOfCards } = require('../../../utils/deck/maxCountOfCards')

// Middleware for editing decks
router.put('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    try {
        var user = await axios.get(`${process.env.AUTH_SERVER}/get/checkIfLoggedIn?email=${req.body.email}&token=${req.body.token}&refreshToken=${req.body.refreshToken}`)
    } catch (e) {
        return res.status(e.response.data.code).send({ status: e.response.data.status, code: e.response.data.code, action: e.response.data.action })
    }

    if (user.data) {
        var deck = await Deck.findOne({ _id: req.body.id, deleted: false })
        if (deck) {
            var strength = 0
            var q = 0
            for (let i = 0; i < req.body.cards.length; i++) {
                q += req.body.cards[i].quantity
            }
            if (q > maxCountOfCards) {
                return res.status(401).send({ status: 'TOO MUCH CARDS IN DECK', code: 401, action: 'RELOAD' })
            }
            var userCards = await UserCard.findOne({ owner: req.body.email })
            for (let i = 0; i < req.body.cards.length; i++) {
                var card = await Card.findOne({ _id: req.body.cards[i]._id, readyToUse: true })
                if (checkIfUserHasCard(card, userCards)) {
                    if (card.nation.includes(req.body.nation) || card.nation[0] == 'All') {
                        if (card) {
                            strength += ((card.type.length + card.attack + card.defense + card.mobility + card.effects.length) * req.body.cards[i].quantity)
                        } else {
                            return res.status(404).send({ status: 'CARD NOT FOUND', code: 404, action: 'RELOAD' })
                        }
                    } else {
                        return res.status(401).send({ status: 'SOME CARDS DOES NOT BELONG TO NATION YOU WANT TO USE A DECK FOR', code: 401, action: 'RELOAD' })
                    }
                } else {
                    return res.status(401).send({ status: 'USER DOES NOT HAVE THIS CARD', code: 401, action: 'RELOAD' })
                }


            }
            if (deck.owner == req.body.email) {
                const filter = {
                    _id: deck._id
                }
                const update = {
                    name: req.body.name,
                    cards: req.body.cards,
                    strength: strength
                }

                await Deck.updateOne(filter, update)
                return res.status(200).send({ status: 'DECK UPDATED', code: 200, action: 'RELOAD PAGE' })
            }

            return res.status(401).send({ status: 'YOU ARE NOT AN OWNER', code: 404, action: 'REDIRECT TO MAIN SCREEN' })
        }

        return res.status(401).send({ status: 'DECK NOT FOUND, ', code: 404, action: 'REDIRECT TO MY DECKS' })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

/**
 * Validates data sent by user to edit his deck
 * @param {object} req
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        name: Joi.string().min(1).required(),
        nation: Joi.string().min(1).required(),
        cards: Joi.array().required(),
        id: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router