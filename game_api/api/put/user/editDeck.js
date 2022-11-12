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
const { actions } = require('../../../utils/enums/action')

// Middleware for editing decks
router.put('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: actions.BAD_DATA_POPUP })
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
            return res.status(401).send({ status: 'TOO MUCH CARDS IN DECK', code: 401, action: actions.RELOAD })
        }

        let deckNation = undefined
        try {
            deckNation = await Card_Nation.findOne({ _id: deck.nation, readyToUse: true })
        } catch (e) { }
        if (!deckNation) {
            return res.status(401).send({ status: 'THIS NATION HAS BEEN TURNED OFF', code: 401, action: actions.RELOAD })
        }
        const userCards = await UserCard.findOne({ owner: req.body.email })
        for (let i = 0; i < req.body.cards.length; i++) {
            let card = undefined
            try {
                card = await Card.findOne({ _id: req.body.cards[i]._id })
            } catch (e) { }
            if (!card) {
                return res.status(404).send({ status: 'CARD NOT FOUND', code: 404, action: actions.RELOAD })
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
                    return res.status(401).send({ status: 'SOME CARDS DOES NOT BELONG TO NATION YOU WANT TO USE A DECK FOR', code: 401, action: actions.RELOAD })
                }
            } else {
                return res.status(401).send({ status: 'USER DOES NOT HAVE THIS CARD', code: 401, action: actions.RELOAD })
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

            try {
                await Deck.updateOne(filter, update)
            } catch (e) { }
            return res.status(200).send({ status: 'DECK UPDATED', code: 200, action: 'RELOAD PAGE' })
        }

        return res.status(401).send({ status: 'YOU ARE NOT AN OWNER', code: 404, action: 'REDIRECT TO MAIN SCREEN' })
    }

    return res.status(401).send({ status: 'DECK NOT FOUND, ', code: 404, action: 'REDIRECT TO MY DECKS' })
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
        cards: Joi.array().required(),
        id: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router