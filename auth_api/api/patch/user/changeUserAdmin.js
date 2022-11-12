const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { checkToken, askNewToken } = require('../../../utils/auth/auth_token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')
const { User } = require('../../../models/user')
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
        if (!user.admin) {
            return res.status(401).send({ status: statuses.YOU_ARE_NOT_AN_ADMIN, code: 401, action: actions.LOGOUT })
        }

        if (checkIfBanned(user)) {
            return res.status(401).send({ status: statuses.USER_IS_BANNED, code: 401, action: actions.LOGOUT })
        }

        let check = checkToken(user.email, req.body.token, process.env.AUTHORIZATION)
        if (!check) {
            check = await askNewToken(user.email, req.body.refreshToken, user._id)
            if (check) {
                await changeUserAdmin(req.body.user, req.body.admin)
                return res.status(200).send({ status: statuses.USER_IS_ADMIN, code: 200, admin: req.body.admin, token: check, action: actions.ACCOUNT_ADMINED_POPUP })
            }
            return res.status(401).send({ status: statuses.USER_NOT_AUTHORIZED, code: 401, action: actions.LOGOUT })
        }

        await changeUserAdmin(req.body.user, req.body.admin)
        return res.status(200).send({ status: statuses.USER_IS_ADMIN, code: 200, admin: req.body.admin, action: actions.ACCOUNT_ADMINED_POPUP })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.LOGOUT })
})

/**
 * Changes user username to username variable value
 * @param {string} id of user to alter
 * @param {bool} admin
 */
async function changeUserAdmin(id, admin) {
    const filter = {
        _id: id
    }
    const update = {
        admin: admin
    }

    try {
        await User.updateOne(filter, update)
    } catch (e) { }
}

/**
 * Validates data sent by user to change his username
 * @param {object} req object
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        admin: Joi.bool().required(),
        user: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router