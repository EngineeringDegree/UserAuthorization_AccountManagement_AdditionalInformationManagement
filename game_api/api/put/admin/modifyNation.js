const express = require('express')
const router = express.Router()
const Joi = require('joi')
const axios = require('axios')
const { Card_Nation } = require('../../../models/card_nation')

// Middleware for puting nations
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
            var nation = await Card_Nation.findOne({ _id: req.body.id })
        } catch (e) {
            return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
        }
        if (nation) {
            const filter = {
                _id: nation._id
            }
            const update = {
                name: req.body.name,
                description: req.body.description,
                mobility: req.body.mobility,
                defence: req.body.defence,
                attack: req.body.attack,
                readyToUse: req.body.readyToUse
            }

            await Card_Nation.updateOne(filter, update)
            return res.status(200).send({ status: 'NATION MODIFIED', code: 200, token: user.data.token })
        }
        return res.status(404).send({ status: 'NATION NOT FOUND', code: 404, action: '' })
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
        mobility: Joi.number().required(),
        defence: Joi.number().required(),
        attack: Joi.number().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router