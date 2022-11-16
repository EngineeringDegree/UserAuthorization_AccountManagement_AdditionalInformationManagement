const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const { Map } = require('../../../models/map')
const { filterMapSize } = require('../../../utils/filter/filterMapSize')
const { checkIfFieldsAreOkay, checkIfStartingPositionsAreOkay } = require('../../../utils/map/check')
const { statuses } = require('../../../utils/enums/status')

// Middleware for creating a card
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    if (res.locals.user.data) {
        const mapCreated = await createMap(req.body)
        if (mapCreated) {
            return res.status(200).send({ status: statuses.MAP_CREATED, code: 200, token: res.locals.user.data.token })
        }

        return res.status(400).send({ status: statuses.BAD_SIZE, code: 400 })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
})

/**
 * Save map with following arguments
 * @param {object} map to save 
 */
async function createMap(map) {
    const sizeToSave = filterMapSize(map.size)
    if (!sizeToSave) {
        return false
    }

    const goodFields = await checkIfFieldsAreOkay(map.fields, map.size)
    if (!goodFields) {
        return false
    }

    const goodStartingPostions = checkIfStartingPositionsAreOkay(map.startingPositions, map.size)
    if (!goodStartingPostions) {
        return false
    }

    let newMap = new Map(_.pick({
        name: map.name,
        size: sizeToSave,
        image: map.image,
        fields: map.fields,
        startingPositions: map.startingPositions,
        readyToUse: false,
        description: map.description
    }, ['name', 'size', 'image', 'fields', 'startingPositions', 'readyToUse', 'description']))
    try {
        await newMap.save()
    } catch (e) {
        return false
    }
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