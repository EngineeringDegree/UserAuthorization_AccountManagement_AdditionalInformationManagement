const express = require('express')
const Joi = require('joi')
const router = express.Router()
const { User } = require('../../../models/user')
const { checkToken, askNewToken } = require('../../../utils/auth/auth_token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

/*
This middleware checks if user has good credentials on his side.
If this is the case returns proper info to him and if needed generates new token for him and sends info if user is admin.
If opposite happens there is sent signal to user which indicates logout action from frontend.
User sends to this middleware email, token, refreshToken. 
*/
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: actions.LOGOUT })
    }

    const user = await User.findOne({ email: req.query.email })
    if (!user) {
        return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.LOGOUT })
    }

    if (checkIfBanned(user)) {
        return res.status(401).send({ status: statuses.USER_IS_BANNED, code: 401, action: actions.LOGOUT })
    }

    let check = await checkToken(user.email, req.query.token, process.env.AUTHORIZATION)
    if (check) {
        return res.status(200).send({ status: statuses.USER_LOGGED_IN, code: 200, action: actions.LOGIN, admin: user.admin, funds: user.funds, confirmed: user.confirmed, email: user.email, id: user._id })
    }

    check = await askNewToken(user.email, req.query.refreshToken, user._id)
    if (!check) {
        return res.status(401).send({ status: statuses.USER_NOT_AUTHORIZED, code: 401, action: actions.LOGOUT })
    }
    return res.status(200).send({ status: statuses.USER_LOGGED_IN, code: 200, action: actions.LOGIN, token: check, admin: user.admin, funds: user.funds, confirmed: user.confirmed, email: user.email, id: user._id })
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
        refreshToken: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router