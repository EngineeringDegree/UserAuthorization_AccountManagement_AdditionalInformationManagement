const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const { Card_Nation } = require('../../../models/card_nation')
const { statuses } = require('../../../utils/enums/status')

// Middleware for creating a card
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    if (res.locals.user.data) {
        await createNation(req.body)
        return res.status(200).send({ status: statuses.NATION_CREATED, code: 200, token: res.locals.user.data.token })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
})

/**
 * Save map with following arguments
 * @param {object} nation to save 
 */
async function createNation(nation) {
    let newNation = new Card_Nation(_.pick({
        name: nation.name,
        description: nation.nation,
        mobility: nation.mobility,
        defence: nation.defence,
        attack: nation.attack,
        vision: nation.vision,
        readyToUse: false
    }, ['name', 'description', 'mobility', 'defence', 'attack', 'vision', 'readyToUse']))
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
        vision: Joi.number().required(),
        nation: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router