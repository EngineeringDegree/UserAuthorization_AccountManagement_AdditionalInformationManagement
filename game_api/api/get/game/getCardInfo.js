const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Card } = require('../../../models/card')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: actions.BAD_DATA_POPUP })
    }

    let card = undefined
    try {
        card = await Card.findOne({ _id: req.query.id, readyToUse: true })
    } catch (e) { }
    if (card) {
        return res.status(200).send({ status: statuses.OK, code: 200, card: card, quantity: req.query.quantity })
    }

    return res.status(404).send({ status: statuses.CARD_NOT_FOUND, code: 404, action: actions.CARD_NOT_FOUND_POPUP })
})

function validate(req) {
    const schema = Joi.object({
        id: Joi.string().required(),
        quantity: Joi.number().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router