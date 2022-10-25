const express = require('express')
const router = express.Router()
const Joi = require('joi')
var { Card } = require('../../../models/card')

router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    var card = undefined
    try {
        card = await Card.findOne({ _id: req.query.id, readyToUse: true })
    } catch (e) { }
    if (card) {
        return res.status(200).send({ status: 'OK', code: 200, card: card, quantity: req.query.quantity })
    }

    return res.status(404).send({ status: 'CARD NOT FOUND', code: 404, action: 'CARD NOT FOUND POPUP' })
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