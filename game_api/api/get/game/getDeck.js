const express = require('express')
const router = express.Router()
const axios = require('axios')
const Joi = require('joi')
var { Deck } = require('../../../models/deck')

router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    try {
        var user = await axios.get(`${process.env.AUTH_SERVER}/get/checkIfLoggedIn?email=${req.query.email}&token=${req.query.token}&refreshToken=${req.query.refreshToken}`)
    } catch (e) {
        return res.status(e.response.data.code).send({ status: e.response.data.status, code: e.response.data.code, action: e.response.data.action })
    }

    if (user.data) {
        var deck = await Deck.findOne({ _id: req.query.id })
        if (deck) {
            if (deck.owner == req.query.email) {
                if (user.data.token) {
                    return res.status(200).send({ status: 'OK', code: 200, deck: deck, token: user.data.token })
                }
                return res.status(200).send({ status: 'OK', code: 200, deck: deck })
            }

            return res.status(401).send({ status: 'DECK IS NOT YOURS', code: 401, action: 'NOT AN OWNER POPUP' })
        }

        return res.status(404).send({ status: 'DECK NOT FOUND', code: 404, action: 'DECK NOT FOUND' })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

function validate(req) {
    const schema = Joi.object({
        id: Joi.string().required(),
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router