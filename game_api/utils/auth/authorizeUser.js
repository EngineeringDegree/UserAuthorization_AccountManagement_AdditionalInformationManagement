const express = require('express')
const router = express.Router()
const Joi = require('joi')
const _ = require('lodash')
const axios = require('axios')
const { statuses } = require('../enums/status')
const { actions } = require('../enums/action')

router.use('/', async (req, res, next) => {
    let authBody = {
        email: undefined,
        token: undefined,
        refreshToken: undefined
    }

    if (_.isEmpty(req.body)) {
        authBody = {
            email: req.query.email,
            token: req.query.token,
            refreshToken: req.query.refreshToken,
        }
    } else {
        authBody = {
            email: req.body.email,
            token: req.body.token,
            refreshToken: req.body.refreshToken,
        }
    }

    const { error } = validate(authBody)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: actions.BAD_DATA_POPUP })
    }

    let user = undefined
    try {
        user = await axios.get(`${process.env.AUTH_SERVER}/get/checkIfLoggedIn?email=${authBody.email}&token=${authBody.token}&refreshToken=${authBody.refreshToken}`)
    } catch (e) {
        return res.status(e.response.data.code).send({ status: e.response.data.status, code: e.response.data.code, action: e.response.data.action })
    }

    res.locals.user = user
    next()
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
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