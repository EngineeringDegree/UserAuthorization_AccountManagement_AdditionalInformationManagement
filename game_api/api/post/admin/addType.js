const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const { Card_Type } = require('../../../models/card_type')

// Middleware for creating a card
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    if (res.locals.user.data) {
        await createType(req.body)
        return res.status(200).send({ status: 'TYPE CREATED', code: 200, token: res.locals.user.data.token })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

/**
 * Save map with following arguments
 * @param {object} type to save 
 */
async function createType(type) {
    var newType = new Card_Type(_.pick({
        name: type.name,
        description: type.type,
        buffNearbyAllies: type.buffNearbyAllies,
        debuffNearbyEnemies: type.debuffNearbyEnemies,
        mobility: type.mobility,
        defence: type.defence,
        attack: type.attack,
        vision: type.vision,
        stunImmunity: type.stunImmunity,
        scareImmunity: type.scareImmunity,
        silenceImmunity: type.silenceImmunity,
        charge: type.charge,
        readyToUse: false
    }, ['name', 'description', 'buffNearbyAllies', 'debuffNearbyEnemies', 'mobility', 'defence', 'attack', 'vision', 'stunImmunity', 'scareImmunity', 'silenceImmunity', 'charge', 'readyToUse']))
    try {
        await newType.save()
    } catch (e) { }
}

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothing if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        name: Joi.string().min(1).required(),
        type: Joi.string().required(),
        buffNearbyAllies: Joi.string().required(),
        debuffNearbyEnemies: Joi.string().required(),
        mobility: Joi.number().required(),
        defence: Joi.number().required(),
        attack: Joi.number().required(),
        vision: Joi.number().required(),
        stunImmunity: Joi.boolean().required(),
        scareImmunity: Joi.boolean().required(),
        silenceImmunity: Joi.boolean().required(),
        charge: Joi.boolean().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router