const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { checkDeckStrengthAndUpdate } = require('../../../utils/deck/checkStrengthAndUpdate')
const { Card_Nation } = require('../../../models/card_nation')
const { Deck } = require('../../../models/deck')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400_POPUP })
    }

    if (res.locals.user.data) {
        let deck = undefined
        try {
            deck = await Deck.findOne({ _id: req.query.id })
        } catch (e) { }
        if (deck) {
            if (deck.owner == req.query.userId) {
                const nation = await Card_Nation.findOne({ _id: deck.nation })
                if (nation) {
                    let strength = await checkDeckStrengthAndUpdate(deck._id)
                    deck.strength = strength
                    return res.status(200).send({ status: statuses.OK, code: 200, deck: deck, token: res.locals.user.data.token, nation: nation.name })
                }

                return res.status(404).send({ status: statuses.NATION_NOT_FOUND, code: 404, action: actions.NATION_NOT_FOUND_POPUP })
            }

            return res.status(401).send({ status: statuses.DECK_IS_NOT_YOURS, code: 401, action: actions.NOT_AN_OWNER_POPUP })
        }

        return res.status(404).send({ status: statuses.DECK_NOT_FOUND, code: 404, action: actions.DECK_NOT_FOUND })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
})

function validate(req) {
    const schema = Joi.object({
        id: Joi.string().required(),
        userId: Joi.string().required(),
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router