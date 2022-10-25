const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Card } = require('../../../models/card')
const { Card_Nation } = require('../../../models/card_nation')
const { Card_Effect } = require('../../../models/card_effect')
const { Card_Type } = require('../../../models/card_type')
const { collectionFilter } = require('../../../utils/filter/collectionFilter')

// Middleware for patching card
router.put('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    if (res.locals.user.data) {
        try {
            var card = await Card.findOne({ _id: req.body.id })
        } catch (e) {
            return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
        }
        if (card) {

            var nations = req.body.nation
            var types = req.body.type
            var effects = req.body.effects
            var nation = await collectionFilter(nations, Card_Nation)
            var type = await collectionFilter(types, Card_Type)
            var effect = await collectionFilter(effects, Card_Effect)

            const filter = {
                _id: card._id
            }
            const update = {
                name: req.body.name,
                image: req.body.image,
                type: type,
                nation: nation,
                resources: req.body.resources,
                attack: req.body.attack,
                defense: req.body.defense,
                mobility: req.body.mobility,
                vision: req.body.vision,
                effects: effect,
                readyToUse: req.body.readyToUse,
                description: req.body.description,
                basicDeck: req.body.basicDeck
            }

            try {
                await Card.updateOne(filter, update)
            } catch (e) {
                return res.status(500).send({ status: 'CARD NOT MODIFIED', code: 500, action: 'TRY LATER POPUP' })
            }
            return res.status(200).send({ status: 'CARD MODIFIED', code: 200, token: res.locals.user.data.token })
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
        vision: Joi.number().required(),
        effects: Joi.array().required(),
        readyToUse: Joi.boolean().required(),
        description: Joi.string().required(),
        basicDeck: Joi.number().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router