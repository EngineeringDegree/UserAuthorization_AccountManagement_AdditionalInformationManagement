const express = require('express')
const router = express.Router()
const Joi = require('joi')
const _ = require('lodash')
const { checkToken, askNewToken } = require('../../../utils/auth/auth_token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')
const { sendPasswordChangeEmail } = require('../../../utils/emails/user_emails')
const { User } = require('../../../models/user')
const { Token } = require('../../../models/token')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

// Middleware for changing user username
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: actions.BAD_DATA_POPUP })
    }

    const user = await User.findOne({ email: req.body.email })
    if (user) {
        if (checkIfBanned(user)) {
            return res.status(401).send({ status: statuses.USER_IS_BANNED, code: 401, action: actions.LOGOUT })
        }

        let check = await checkToken(user.email, req.body.token, process.env.AUTHORIZATION)
        if (!check) {
            check = await askNewToken(user.email, req.body.refreshToken, user._id)
            if (check) {
                const accessToken = await Token.findOne({ owner: user.email, type: process.env.ACCESS })
                if (!accessToken) {
                    return res.status(401).send({ status: statuses.NO_ACCESS_TOKEN, code: 404, action: actions.NO_ACCESS_TOKEN_POPUP })
                }
                sendPasswordChangeEmail({ email: user.email, accessToken: accessToken.token })
                return res.status(200).send({ status: statuses.PASSWORD_EMAIL_SENT, code: 200, username: req.body.newUsername, token: check })
            }
            return res.status(401).send({ status: statuses.USER_NOT_AUTHORIZED, code: 401, action: actions.LOGOUT })
        }
        const accessToken = await Token.findOne({ owner: user.email, type: process.env.ACCESS })
        if (!accessToken) {
            return res.status(401).send({ status: statuses.NO_ACCESS_TOKEN, code: 404, action: actions.NO_ACCESS_TOKEN_POPUP })
        }
        sendPasswordChangeEmail({ email: user.email, accessToken: accessToken.token })
        return res.status(200).send({ status: statuses.PASSWORD_EMAIL_SENT, code: 200, username: req.body.newUsername })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.LOGOUT })
})

/**
 * Validates data sent by user to change his username
 * @param {object} req object
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router