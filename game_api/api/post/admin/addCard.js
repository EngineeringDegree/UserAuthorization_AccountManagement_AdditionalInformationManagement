const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const { Card } = require('../../../models/card')
const { Card_Nation } = require('../../../models/card_nation')
const { Card_Effect } = require('../../../models/card_effect')
const { Card_Type } = require('../../../models/card_type')
const { collectionFilter } = require('../../../utils/filter/collectionFilter')
const { statuses } = require('../../../utils/enums/status')

// Middleware for creating a card
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    if (res.locals.user.data) {
        await createCard(req.body)
        return res.status(200).send({ status: statuses.CARD_CREATED, code: 200, token: res.locals.user.data.token })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
})

/**
 * Save card with following arguments
 * @param {object} card to save 
 */
async function createCard(card) {
    const nations = card.nation
    const types = card.type
    const effects = card.effects
    const nation = await collectionFilter(nations, Card_Nation)
    const type = await collectionFilter(types, Card_Type)
    const effect = await collectionFilter(effects, Card_Effect)

    let newCard = new Card(_.pick({
        name: card.name,
        image: card.image,
        type: type,
        nation: nation,
        resources: card.resources,
        attack: card.attack,
        defense: card.defense,
        mobility: card.mobility,
        vision: card.vision,
        effects: effect,
        readyToUse: false,
        description: card.description,
        basicDeck: card.basicDeck
    }, ['name', 'image', 'type', 'nation', 'resources', 'attack', 'defense', 'mobility', 'vision', 'effects', 'readyToUse', 'description', 'basicDeck']))
    try {
        await newCard.save()
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
        name: Joi.string().min(1).required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        image: Joi.string().required(),
        type: Joi.array().required(),
        nation: Joi.array().required(),
        resources: Joi.number().required(),
        attack: Joi.number().required(),
        defense: Joi.number().required(),
        mobility: Joi.number().required(),
        vision: Joi.number().required(),
        effects: Joi.array().required(),
        description: Joi.string().required(),
        basicDeck: Joi.number().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router