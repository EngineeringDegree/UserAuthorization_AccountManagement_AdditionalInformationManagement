const express = require('express')
const router = express.Router()
const Joi = require('joi')
const axios = require('axios')
const { Pack } = require('../../../models/packs')

// Middleware for patching card
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    try {
        var user = await axios.get(`${process.env.AUTH_SERVER}/get/checkIfLoggedIn?email=${req.body.email}&token=${req.body.token}&refreshToken=${req.body.refreshToken}`)
    } catch (e) {
        return res.status(e.response.data.code).send({ status: e.response.data.status, code: e.response.data.code, action: e.response.data.action })
    }

    if (user.data) {
        try {
            var pack = await Pack.findOne({ _id: req.body.id })
        } catch (e) {
            return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
        }
        if (pack) {
            const filter = {
                _id: pack._id
            }
            const update = {
                used: true
            }

            // add to card user_card database
            await Pack.updateOne(filter, update)
            return res.status(200).send({ status: 'PACK OPENED', code: 200, token: user.data.token, id: pack._id })
        }
        return res.status(404).send({ status: 'CARD NOT FOUND', code: 404, action: 'GO TO CARDS' })
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
        id: Joi.string().min(1).required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router