const express = require('express')
const Joi = require('joi')
const router = express.Router()
const { User } = require('../../../models/user')
const { checkToken, askNewToken } = require('../../../utils/auth/auth_token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')
const { statuses } = require('../../../utils/enums/status')

/*
This middleware checks if user has good credentials on his side.
If this is the case returns proper info to him and if needed generates new token for him.
If opposite happens there is sent signal to user which indicates logout action from frontend.
User sends to this middleware email, token, refreshToken. Works for admin.
*/
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    const user = await User.findOne({ email: req.query.email })
    if (!user) {
        return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
    }

    if (checkIfBanned(user)) {
        return res.status(401).send({ status: statuses.USER_IS_BANNED, code: 401 })
    }

    if (!user.admin) {
        return res.status(401).send({ status: statuses.USER_NOT_AUTHORIZED, code: 401 })
    }

    let check = checkToken(user._id, req.query.token, process.env.AUTHORIZATION)
    if (!check) {
        check = await askNewToken(user._id, req.query.refreshToken, user._id)
        if (!check) {
            return res.status(401).send({ status: statuses.USER_NOT_AUTHORIZED, code: 401 })
        }

        return res.status(200).send({ status: statuses.USER_LOGGED_IN, code: 200, email: user.email, id: user._id, token: check })
    }


    return res.status(200).send({ status: statuses.USER_LOGGED_IN, code: 200, email: user.email, id: user._id })
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