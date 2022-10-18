const express = require('express')
const Joi = require('joi')
const router = express.Router()
const { User } = require('../../../models/user')
const { checkToken, askNewToken } = require('../../../utils/auth/auth_token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')

/*
This middleware checks if user has good credentials on his side and subtracts funds for user
*/
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'LOGOUT' })
    }

    if (req.body.gameApiSecret != process.env.GAME_API_SECRET) {
        return res.status(401).send({ status: 'YOU CANNOT START YOUR OWN REFUND', code: 401, action: 'LOGOUT' })
    }

    let user = await User.findOne({ email: req.body.email })
    if (user) {
        if (checkIfBanned(user)) {
            return res.status(401).send({ status: 'USER IS BANNED', code: 401, action: 'LOGOUT' })
        }
        var check = checkToken(user.token, req.body.token)
        if (!check) {
            check = await askNewToken(user.refreshToken, req.body.refreshToken, user)
            if (check) {
                await changeUserAdmin(user.funds, req.body.refund, user._id)
                return res.status(200).send({ status: 'BOUGHT', code: 200, action: 'BOUGHT' })
            }
            return res.status(401).send({ status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT' })
        }

        await changeUserAdmin(user.funds, req.body.refund, user._id)
        return res.status(200).send({ status: 'BOUGHT', code: 200, action: 'BOUGHT' })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

/**
 * Changes user funds
 * @param {number} funds of user
 * @param {number} refund to add
 * @param {string} id of user
 */
async function changeUserAdmin(funds, refund, id) {
    const filter = {
        _id: id
    }
    const update = {
        funds: funds + refund
    }

    await User.updateOne(filter, update)
}

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
        gameApiSecret: Joi.string().required(),
        refund: Joi.number().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router