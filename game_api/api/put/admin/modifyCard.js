const express = require('express')
const router = express.Router()
const Joi = require('joi')
const axios = require('axios')
const { Card } = require('../../../models/card')

// Middleware for patching card
router.put('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    try {
        var user = await axios.get(`${process.env.AUTH_SERVER}/get/admin/premisions?email=${req.body.email}&token=${req.body.token}&refreshToken=${req.body.refreshToken}`)
    } catch (e) {
        return res.status(e.response.data.code).send({ status: e.response.data.status, code: e.response.data.code, action: e.response.data.action })
    }

    if (user.data) {
        try {
            var card = await Card.findOne({ _id: req.body.id })
        } catch (e) {
            return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
        }
        if (card) {
            const filter = {
                _id: card._id
            }
            const update = {
                name: req.body.name,
                image: req.body.image,
                type: req.body.type,
                nation: req.body.nation,
                resources: req.body.resources,
                attack: req.body.attack,
                defense: req.body.defense,
                mobility: req.body.mobility,
                effects: req.body.effects,
                readyToUse: req.body.readyToUse,
                description: req.body.description,
                basicDeck: req.body.basicDeck
            }

            await Card.updateOne(filter, update)
            return res.status(200).send({ status: 'CARD MODIFIED', code: 200, token: user.data.token })
        }
        return res.status(404).send({ status: 'CARD NOT FOUND', code: 404, action: 'GO TO CARDS' })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

/**
 * Validates data sent by user to log in
 * @param {object} req
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        id: Joi.string().min(1).required(),
        name: Joi.string().min(1).required(),
        image: Joi.string().required(),
        type: Joi.array().required(),
        nation: Joi.array().required(),
        resources: Joi.number().required(),
        attack: Joi.number().required(),
        defense: Joi.number().required(),
        mobility: Joi.number().required(),
        effects: Joi.array().required(),
        readyToUse: Joi.boolean().required(),
        description: Joi.string().required(),
        basicDeck: Joi.number().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router