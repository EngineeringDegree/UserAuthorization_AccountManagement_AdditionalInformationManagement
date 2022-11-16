const express = require('express')
const Joi = require('joi')
const router = express.Router()
const { User } = require('../../../models/user')
const { Token } = require('../../../models/token')
const { statuses } = require('../../../utils/enums/status')

/*
Checks if user exists
*/
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
    }

    const accessToken = await Token.findOne({ owner: user._id, token: req.body.accessToken, type: process.env.ACCESS })
    if (!accessToken) {
        return res.status(401).send({ status: statuses.BAD_TOKEN, code: 401 })
    }

    if (user.confirmed) {
        return res.status(406).send({ status: statuses.ACCOUNT_ALREADY_CONFIRMED, code: 406 })
    }

    const filter = {
        _id: user._id
    }
    const update = {
        confirmed: true
    }

    try {
        const result = await User.updateOne(filter, update)
        return res.status(200).send({ status: statuses.ACCOUNT_CONFIRMED, code: 200 })
    } catch (e) {
        return res.status(500).send({ status: statuses.ACCOUNT_NOT_CONFIRMED, code: 500 })
    }
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        accessToken: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router