
const express = require('express')
const Joi = require('joi')
const router = express.Router()
const { User } = require('../../../models/user')
const { checkToken, askNewToken } = require('../../../utils/auth/auth_token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')

/*
This middleware checks if user has good credentials on his side.
If this is the case returns proper info to him and if needed generates new token for him.
If opposite happens there is sent signal to user which indicates logout action from frontend.
User sends to this middleware email, token, refreshToken. Works for admin.
*/
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400 })
    }

    const user = await User.findOne({ email: req.query.email })
    if (user) {
        if (checkIfBanned(user)) {
            return res.status(401).send({ status: 'USER IS BANNED', code: 401, action: 'LOGOUT' })
        }
        if (user.admin) {
            let check = checkToken(user.token, req.query.token)
            if (!check) {
                check = await askNewToken(user.refreshToken, req.query.refreshToken, user)
                if (check) {
                    return res.status(200).send({ status: 'USER LOGGED IN', code: 200, action: 'LOGIN', token: check })
                }
                return res.status(401).send({ status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT' })
            }
            return res.status(200).send({ status: 'USER LOGGED IN', code: 200, action: 'LOGIN', token: req.query.token })
        }
        return res.status(401).send({ status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT' })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
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