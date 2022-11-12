const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const { Map_Field } = require('../../../models/map_field')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

// Middleware for creating a map field
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: actions.BAD_DATA_POPUP })
    }

    if (res.locals.user.data) {
        await createField(req.body)
        return res.status(200).send({ status: 'EFFECT CREATED', code: 200, token: res.locals.user.data.token })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.LOGOUT })
})

/**
 * Save map field with following arguments
 * @param {object} mapField to save 
 */
async function createField(mapField) {
    let newField = new Map_Field(_.pick({
        name: mapField.name,
        description: mapField.description,
        basicDefence: mapField.basicDefence,
        basicMobilityCost: mapField.basicMobilityCost,
        visionCost: mapField.visionCost,
        readyToUse: false
    }, ['name', 'description', 'basicDefence', 'basicMobilityCost', 'visionCost', 'readyToUse']))
    try {
        await newField.save()
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
        basicDefence: Joi.number().required(),
        basicMobilityCost: Joi.number().required(),
        visionCost: Joi.number().required(),
        description: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router