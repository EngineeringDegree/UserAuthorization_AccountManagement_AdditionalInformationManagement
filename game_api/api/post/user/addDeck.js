const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const { Deck } = require('../../../models/deck')
const { Card } = require('../../../models/card')
const { UserCard } = require('../../../models/user_cards')
const { checkIfUserHasCard } = require('../../../utils/deck/checkIfUserHasCard')
const { maxCountOfCards } = require('../../../utils/deck/maxCountOfCards')

// Middleware for creating a deck
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    if (res.locals.user.data) {
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
        await createDeck({ name: req.body.name, nation: req.body.nation, cards: req.body.cards }, strength, req.body.email)
        return res.status(200).send({ status: 'DECK CREATED', code: 200, token: res.locals.user.data.token })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

/**
 * Save card with following arguments
 * @param {object} deck to save 
 * @param {number} strength of deck
 * @param {string} owner of deck
 */
async function createDeck(deck, strength, owner) {
    var newDeck = new Deck(_.pick({
        name: deck.name,
        nation: deck.nation,
        cards: deck.cards,
        strength: strength,
        owner: owner,
        deleted: false
    }, ['name', 'nation', 'cards', 'strength', 'owner', 'deleted']))
    await newDeck.save()
}

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        name: Joi.string().required(),
        nation: Joi.string().required(),
        cards: Joi.array().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router