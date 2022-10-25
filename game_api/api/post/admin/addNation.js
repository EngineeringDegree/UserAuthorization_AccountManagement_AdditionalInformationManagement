const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const { Card_Nation } = require('../../../models/card_nation')

// Middleware for creating a card
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    if (res.locals.user.data) {
        await createNation(req.body)
        return res.status(200).send({ status: 'NATION CREATED', code: 200, token: res.locals.user.data.token })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

/**
 * Save map with following arguments
 * @param {object} nation to save 
 */
async function createNation(nation) {
    var newNation = new Card_Nation(_.pick({
        name: nation.name,
        description: nation.nation,
        mobility: nation.mobility,
        defence: nation.defence,
        attack: nation.attack,
        readyToUse: false
    }, ['name', 'description', 'mobility', 'defence', 'attack', 'readyToUse']))
    try {
        await newNation.save()
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
        mobility: Joi.number().required(),
        defence: Joi.number().required(),
        attack: Joi.number().required(),
        nation: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router