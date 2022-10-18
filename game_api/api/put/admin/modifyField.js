const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Map_Field } = require('../../../models/map_field')

// Middleware for putting effects
router.put('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    if (res.locals.user.data) {
        try {
            var field = await Map_Field.findOne({ _id: req.body.id })
        } catch (e) {
            return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
        }
        if (field) {
            const filter = {
                _id: field._id
            }
            const update = {
                name: req.body.name,
                description: req.body.description,
                basicDefence: req.body.basicDefence,
                basicMobilityCost: req.body.basicMobilityCost,
                readyToUse: req.body.readyToUse
            }

            await Map_Field.updateOne(filter, update)
            return res.status(200).send({ status: 'MAP FIELD MODIFIED', code: 200, token: res.locals.user.data.token })
        }
        return res.status(404).send({ status: 'MAP FIELD NOT FOUND', code: 404, action: '' })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

/**
 * Validates data sent by user to modify shop pack
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
        description: Joi.string().required(),
        basicDefence: Joi.number().required(),
        basicMobilityCost: Joi.number().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router