const express = require('express')
const router = express.Router()
const Joi = require('joi')
const _ = require('lodash')
const { checkIfUserHasCard } = require('../../../utils/deck/checkIfUserHasCard')
const { calculateCardsStrength } = require('../../../utils/calculations/calculateCardStrength')
const { Deck } = require('../../../models/deck')
const { Card } = require('../../../models/card')
const { Card_Nation } = require('../../../models/card_nation')
const { UserCard } = require('../../../models/user_cards')
const { statuses } = require('../../../utils/enums/status')

/*
This middleware sends cards according to parameters if user is admin
*/
router.delete('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    if (res.locals.user.data) {
        let deck = undefined
        try {
            deck = await Deck.findOne({ _id: req.body.deck.id, deleted: false })
        } catch (e) { }
        if (!deck) {
            return res.status(404).send({ status: statuses.DECK_NOT_FOUND, code: 404, token: res.locals.user.data.token })
        }
        if (deck.nation != req.body.deck.nation) {
            return res.status(401).send({ status: statuses.DECK_NATIONS_ARE_DIFFERENT, code: 401, token: res.locals.user.data.token })
        }

        let nation = undefined
        try {
            nation = await Card_Nation.findOne({ _id: req.body.deck.nation })
        } catch (e) { }
        if (!nation) {
            return res.status(404).send({ status: statuses.NATION_NOT_FOUND, code: 404, token: res.locals.user.data.token })
        }

        let newCardsToSave = []
        let strength = 0
        let notSync = false
        for (let i = 0; i < deck.cards.length; i++) {
            let card = undefined
            try {
                card = await Card.findOne({ _id: deck.cards[i]._id })
            } catch (e) { }
            if (card) {
                if (card.nation.includes(deck.nation)) {
                    newCardsToSave.push(deck.cards[i])
                    strength += calculateCardsStrength(card, deck.cards[i].quantity)
                } else {
                    notSync = true
                }
            } else {
                notSync = true
            }
        }

        const filter = {
            _id: deck._id
        }
        const update = {
            cards: newCardsToSave,
            strength: strength
        }
        try {
            await Deck.updateOne(filter, update)
        } catch (e) { }

        if (notSync) {
            return res.status(400).send({ status: statuses.NOT_SYNCHRONIZED, code: 400, token: res.locals.user.data.token })
        }

        const userCards = await UserCard.findOne({ owner: res.locals.user.data.id })
        const prepared = req.body.deck.cards.cardsPrepared
        let q = 0
        for (let i = 0; i < prepared.length; i++) {
            let card = undefined
            try {
                card = await Card.findOne({ _id: prepared[i]._id })
            } catch (e) { }
            if (!card) {
                return res.status(400).send({ status: statuses.NOT_SYNCHRONIZED, code: 400, token: res.locals.user.data.token })
            }
            if (!card.nation.includes(deck.nation)) {
                return res.status(400).send({ status: statuses.NOT_SYNCHRONIZED, code: 400, token: res.locals.user.data.token })
            }

            q += prepared[i].quantity
            const found = checkIfUserHasCard(card, userCards, prepared[i].quantity)
            if (!found || q > process.env.MAX_COUNT_OF_CARDS) {
                return res.status(400).send({ status: statuses.NOT_SYNCHRONIZED, code: 400, token: res.locals.user.data.token })
            }
        }
        return res.status(200).send({ status: statuses.OK, code: 200, token: res.locals.user.data.token })
    }
    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 400 })
})

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
        deck: Joi.object().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router