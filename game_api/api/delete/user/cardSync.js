const express = require('express')
const router = express.Router()
const Joi = require('joi')
const _ = require('lodash')
const { checkIfUserHasCard } = require('../../../utils/deck/checkIfUserHasCard')
const { Card } = require('../../../models/card')
const { Card_Nation } = require('../../../models/card_nation')
const { UserCard } = require('../../../models/user_cards')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

/*
This middleware sends cards according to parameters if user is admin
*/
router.delete('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: actions.LOGOUT })
    }

    if (res.locals.user.data) {
        let nation = undefined
        try {
            nation = await Card_Nation.findOne({ _id: req.body.deck.nation })
        } catch (e) { }
        if (!nation) {
            return res.status(404).send({ status: statuses.NATION_NOT_FOUND, code: 404, action: actions.GO_TO_DECKS_PAGE, token: res.locals.user.data.token })
        }

        const userCards = await UserCard.findOne({ owner: req.body.email })
        const prepared = req.body.deck.cards.cardsPrepared
        let q = 0
        for (let i = 0; i < prepared.length; i++) {
            let card = undefined
            try {
                card = await Card.findOne({ _id: prepared[i]._id })
            } catch (e) { }
            if (!card) {
                return res.status(400).send({ status: statuses.NOT_SYNCHRONIZED, code: 400, token: res.locals.user.data.token, action: actions.RELOAD })
            }
            if (!card.nation.includes(req.body.deck.nation)) {
                return res.status(400).send({ status: statuses.NOT_SYNCHRONIZED, code: 400, token: res.locals.user.data.token, action: actions.RELOAD })
            }

            q += prepared[i].quantity
            let found = checkIfUserHasCard(card, userCards, prepared[i].quantity)
            if (!found || q > process.env.MAX_COUNT_OF_CARDS) {
                return res.status(400).send({ status: statuses.NOT_SYNCHRONIZED, code: 400, token: res.locals.user.data.token, action: actions.RELOAD })
            }
        }
        return res.status(200).send({ status: statuses.OK, code: 200, token: res.locals.user.data.token })
    }
    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 400, action: actions.LOGOUT })
})

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
        deck: Joi.object().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router