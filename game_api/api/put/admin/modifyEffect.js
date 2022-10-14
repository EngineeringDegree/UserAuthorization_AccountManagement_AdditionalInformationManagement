const express = require('express')
const router = express.Router()
const Joi = require('joi')
const axios = require('axios')
const { Card_Effect } = require('../../../models/card_effect')

// Middleware for putting effects
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
            var effect = await Card_Effect.findOne({ _id: req.body.id })
        } catch (e) {
            return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
        }
        if (effect) {
            const filter = {
                _id: effect._id
            }
            const update = {
                name: req.body.name,
                description: req.body.description,
                readyToUse: req.body.readyToUse
            }

            await Card_Effect.updateOne(filter, update)
            return res.status(200).send({ status: 'EFFECT MODIFIED', code: 200, token: user.data.token })
        }
        return res.status(404).send({ status: 'EFFECT NOT FOUND', code: 404, action: '' })
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
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router