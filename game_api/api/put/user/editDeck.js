const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { checkIfUserHasCard } = require('../../../utils/deck/checkIfUserHasCard')
const { calculateCardsStrength } = require('../../../utils/calculations/calculateCardStrength')
const { Deck } = require('../../../models/deck')
const { Card } = require('../../../models/card')
const { Card_Nation } = require('../../../models/card_nation')
const { UserCard } = require('../../../models/user_cards')
const { statuses } = require('../../../utils/enums/status')

// Middleware for editing decks
router.put('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    let deck = undefined
    try {
        deck = await Deck.findOne({ _id: req.body.id, deleted: false })
    } catch (e) { }
    if (deck) {
        let strength = 0
        let q = 0
        for (let i = 0; i < req.body.cards.length; i++) {
            q += (req.body.cards[i].quantity / 1)
        }
        if (q > process.env.MAX_COUNT_OF_CARDS) {
            return res.status(401).send({ status: statuses.TOO_MUCH_CARDS_IN_DECK, code: 401 })
        }

        let deckNation = undefined
        try {
            deckNation = await Card_Nation.findOne({ _id: deck.nation, readyToUse: true })
        } catch (e) { }
        if (!deckNation) {
            return res.status(401).send({ status: statuses.THIS_NATION_HAS_BEEN_TURNED_OFF, code: 401 })
        }
        const userCards = await UserCard.findOne({ owner: req.body.userId })
        for (let i = 0; i < req.body.cards.length; i++) {
            let card = undefined
            try {
                card = await Card.findOne({ _id: req.body.cards[i]._id })
            } catch (e) { }
            if (!card) {
                return res.status(404).send({ status: statuses.CARD_NOT_FOUND, code: 404 })
            }
            if (checkIfUserHasCard(card, userCards, req.body.cards[i].quantity)) {
                let found = false
                for (let j = 0; j < card.nation.length; j++) {
                    let nation = undefined
                    try {
                        nation = await Card_Nation.findOne({ _id: card.nation[j], readyToUse: true })
                    } catch (e) { }
                    if (nation) {
                        if (card.nation[j] == deck.nation) {
                            found = true
                            break
                        }
                    }
                }
                if (found) {
                    strength += calculateCardsStrength(card, req.body.cards[i].quantity)
                } else {
                    return res.status(401).send({ status: statuses.SOME_CARDS_DOES_NOT_BELONG_TO_NATION_YOU_WANT_TO_USE_A_DECK_FOR, code: 401 })
                }
            } else {
                return res.status(401).send({ status: statuses.USER_DOES_NOT_HAVE_THIS_CARD, code: 401 })
            }


        }
        if (deck.owner == req.body.userId) {
            const filter = {
                _id: deck._id
            }
            const update = {
                name: req.body.name,
                cards: req.body.cards,
                strength: strength
            }

            try {
                await Deck.updateOne(filter, update)
            } catch (e) { }
            return res.status(200).send({ status: statuses.UPDATED, code: 200 })
        }

        return res.status(401).send({ status: statuses.YOU_ARE_NOT_AN_OWNER, code: 401 })
    }

    return res.status(401).send({ status: statuses.NOT_FOUND, code: 404 })
})

/**
 * Validates data sent by user to edit his deck
 * @param {object} req
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        userId: Joi.string().required(),
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        name: Joi.string().min(1).required(),
        cards: Joi.array().required(),
        id: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router