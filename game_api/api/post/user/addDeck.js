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
const { actions } = require('../../../utils/enums/action')

// Middleware for creating a deck
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: actions.BAD_DATA_POPUP })
    }

    if (res.locals.user.data) {
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
            deckNation = await Card_Nation.findOne({ _id: req.body.nation, readyToUse: true })
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
                        if (card.nation[j] == req.body.nation) {
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
        await createDeck({ name: req.body.name, nation: req.body.nation, cards: req.body.cards }, strength, req.body.email)
        return res.status(200).send({ status: 'DECK CREATED', code: 200, token: res.locals.user.data.token })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.LOGOUT })
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