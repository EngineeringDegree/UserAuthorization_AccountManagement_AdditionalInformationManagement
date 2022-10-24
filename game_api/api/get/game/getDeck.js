const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { checkDeckStrengthAndUpdate } = require('../../../utils/deck/checkStrengthAndUpdate')
const { Card_Nation } = require('../../../models/card_nation')
const { Deck } = require('../../../models/deck')

router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    if (res.locals.user.data) {
        var deck = await Deck.findOne({ _id: req.query.id })
        if (deck) {
            if (deck.owner == req.query.email) {
                var nation = await Card_Nation.findOne({ _id: deck.nation })
                if (nation) {
                    var strength = await checkDeckStrengthAndUpdate(deck._id)
                    deck.strength = strength
                    return res.status(200).send({ status: 'OK', code: 200, deck: deck, token: res.locals.user.data.token, nation: nation.name })
                }

                return res.status(404).send({ status: 'NATION NOT FOUND', code: 404, action: 'NATION NOT FOUND POPUP' })
            }

            return res.status(401).send({ status: 'DECK IS NOT YOURS', code: 401, action: 'NOT AN OWNER POPUP' })
        }

        return res.status(404).send({ status: 'DECK NOT FOUND', code: 404, action: 'DECK NOT FOUND' })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

function validate(req) {
    const schema = Joi.object({
        id: Joi.string().required(),
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router