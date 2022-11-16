const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Map } = require('../../../models/map')
const { checkIfFieldsAreOkay, checkIfStartingPositionsAreOkay } = require('../../../utils/map/check')
const { filterMapSize } = require('../../../utils/filter/filterMapSize')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

// Middleware for patching map
router.put('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400_POPUP })
    }

    if (res.locals.user.data) {
        let map = undefined
        try {
            map = await Map.findOne({ _id: req.body.id })
        } catch (e) {
            return res.status(400).send({ status: statuses.BAD_DATA, code: 400_POPUP })
        }
        if (map) {
            const sizeToSave = filterMapSize(req.body.size)
            if (!sizeToSave) {
                return res.status(400).send({ status: statuses.BAD_SIZE_DATA, code: 404, action: actions.FOCUS_ON_SIZE_FIELD })
            }

            const goodFields = await checkIfFieldsAreOkay(req.body.fields, req.body.size)
            if (!goodFields) {
                return res.status(400).send({ status: statuses.BAD_FIELDS, code: 404, action: actions.RELOAD })
            }

            const goodStartingPostions = checkIfStartingPositionsAreOkay(req.body.startingPositions, req.body.size)
            if (!goodStartingPostions) {
                return res.status(400).send({ status: statuses.BAD_STARTING_POSITIONS, code: 404, action: actions.RELOAD })
            }

            const filter = {
                _id: map._id
            }
            const update = {
                name: req.body.name,
                size: sizeToSave,
                image: req.body.image,
                fields: req.body.fields,
                startingPositions: req.body.startingPositions,
                readyToUse: req.body.readyToUse,
                description: req.body.description
            }

            try {
                await Map.updateOne(filter, update)
            } catch (e) {
                return res.status(500).send({ status: statuses.NOT_MODIFIED, code: 500, action: actions.TRY_LATER_POPUP })
            }
            return res.status(200).send({ status: statuses.MODIFIED, code: 200, token: res.locals.user.data.token })
        }
        return res.status(404).send({ status: statuses.NOT_FOUND, code: 404 })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
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
        size: Joi.string().required(),
        image: Joi.string().required(),
        fields: Joi.array().required(),
        startingPositions: Joi.array().required(),
        readyToUse: Joi.boolean().required(),
        description: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router