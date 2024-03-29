const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const { checkIfUserHasCard } = require('../../../utils/deck/checkIfUserHasCard')
const { calculateCardsStrength } = require('../../../utils/calculations/calculateCardStrength')
const { Deck } = require('../../../models/deck')
const { Card } = require('../../../models/card')
const { Card_Nation } = require('../../../models/card_nation')
const { UserCard } = require('../../../models/user_cards')
const { statuses } = require('../../../utils/enums/status')

// Middleware for creating a deck
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    if (res.locals.user.data) {
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
            deckNation = await Card_Nation.findOne({ _id: req.body.nation, readyToUse: true })
        } catch (e) { }
        if (!deckNation) {
            return res.status(401).send({ status: statuses.THIS_NATION_HAS_BEEN_TURNED_OFF, code: 401 })
        }
        const userCards = await UserCard.findOne({ owner: res.locals.user.data.id })
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
                        if (card.nation[j] == req.body.nation) {
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
        await createDeck({ name: req.body.name, nation: req.body.nation, cards: req.body.cards }, strength, res.locals.user.data.id)
        return res.status(200).send({ status: statuses.DECK_CREATED, code: 200, token: res.locals.user.data.token })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
})

/**
 * Save card with following arguments
 * @param {object} deck to save 
 * @param {number} strength of deck
 * @param {string} owner of deck
 */
async function createDeck(deck, strength, owner) {
    let newDeck = new Deck(_.pick({
        name: deck.name,
        nation: deck.nation,
        cards: deck.cards,
        strength: strength,
        owner: owner,
        deleted: false
    }, ['name', 'nation', 'cards', 'strength', 'owner', 'deleted']))
    try {
        await newDeck.save()
    } catch (e) { }
}

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        id: Joi.string().required(),
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