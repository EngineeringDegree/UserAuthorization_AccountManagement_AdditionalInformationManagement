const express = require('express')
const router = express.Router()
const Joi = require('joi')
const axios = require('axios')
const { Map } = require('../../../models/map')
const { filterMapSize } = require('../../../utils/filter/filterMapSize')

// Middleware for patching map
router.put('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    try {
        var user = await axios.get(`${process.env.AUTH_SERVER}/get/admin/premisions?email=${req.body.email}&token=${req.body.token}&refreshToken=${req.body.refreshToken}`)
    } catch (e) {
        return res.status(e.response.data.code).send({ status: e.response.data.status, code: e.response.data.code, action: e.response.data.action })
    }

    if (user.data) {
        try {
            var map = await Map.findOne({ _id: req.body.id })
        } catch (e) {
            return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
        }
        if (map) {
            var sizeToSave = filterMapSize(req.body.size)
            if (!sizeToSave) {
                return res.status(400).send({ status: 'BAD SIZE DATA', code: 404, action: 'FOCUS ON SIZE FIELD' })
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

            await Map.updateOne(filter, update)
            return res.status(200).send({ status: 'MAP MODIFIED', code: 200, token: user.data.token })
        }
        return res.status(404).send({ status: 'MAP NOT FOUND', code: 404, action: 'GO TO MAPS' })
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