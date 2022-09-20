const express = require('express')
const router = express.Router()
const Joi = require('joi')
const axios = require('axios')
var { UserCard } = require('../../../models/user_cards')

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
        var cardsObj = await UserCard.findOne({ owner: req.query.email })
        if (cardsObj) {
            if (user.data.token) {
                return res.status(200).send({ status: 'OK', code: 200, cards: cardsObj.cards, token: user.data.token })
            }

            return res.status(200).send({ status: 'OK', code: 200, cards: cardsObj.cards })
        }

        return res.status(404).send({ status: 'CARDS NOT FOUND', code: 404, action: 'CARDS NOT FOUND POPUP' })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router