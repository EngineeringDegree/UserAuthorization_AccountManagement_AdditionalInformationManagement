const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const { Map } = require('../../../models/map')
const { filterMapSize } = require('../../../utils/filter/filterMapSize')

// Middleware for creating a card
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    if (res.locals.user.data) {
        var mapCreated = await createMap(req.body)
        if (mapCreated) {
            return res.status(200).send({ status: 'MAP CREATED', code: 200, token: res.locals.user.data.token })
        }

        return res.status(400).send({ status: 'BAD SIZE', code: 400, action: 'FOCUS ON SIZE' })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

/**
 * Save map with following arguments
 * @param {object} map to save 
 */
async function createMap(map) {
    var sizeToSave = filterMapSize(map.size)
    if (!sizeToSave) {
        return false
    }
    var newMap = new Map(_.pick({
        name: map.name,
        size: sizeToSave,
        image: map.image,
        fields: map.fields,
        startingPositions: map.startingPositions,
        readyToUse: false,
        description: map.description
    }, ['name', 'size', 'image', 'fields', 'startingPositions', 'readyToUse', 'description']))
    await newMap.save()
    return true
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
        size: Joi.string().required(),
        image: Joi.string().required(),
        fields: Joi.array().required(),
        startingPositions: Joi.array().required(),
        description: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router