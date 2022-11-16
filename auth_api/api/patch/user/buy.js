const express = require('express')
const Joi = require('joi')
const router = express.Router()
const { User } = require('../../../models/user')
const { checkToken, askNewToken } = require('../../../utils/auth/auth_token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')
const { statuses } = require('../../../utils/enums/status')

/*
This middleware checks if user has good credentials on his side and subtracts funds for user
*/
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    if (req.body.gameApiSecret != process.env.GAME_API_SECRET) {
        return res.status(401).send({ status: statuses.YOU_CANNOT_START_YOUR_OWN_BUY_CALL, code: 401 })
    }

    const user = await User.findOne({ email: req.body.email })
    if (user) {
        if (checkIfBanned(user)) {
            return res.status(401).send({ status: statuses.USER_IS_BANNED, code: 401 })
        }
        let check = checkToken(user._id, req.body.token, process.env.AUTHORIZATION)
        if (!check) {
            check = await askNewToken(user._id, req.body.refreshToken, user._id)
            if (check) {
                if (user.funds >= req.body.price) {
                    await changeUserFunds(user.funds, req.body.price, user._id)
                    return res.status(200).send({ status: statuses.BOUGHT, code: 200, token: check })
                }
                return res.status(401).send({ status: statuses.INSUFFICIENT_FUNDS, code: 401, token: check })
            }
            return res.status(401).send({ status: statuses.USER_NOT_AUTHORIZED, code: 401 })
        }
        if (user.funds >= req.body.price) {
            await changeUserFunds(user.funds, req.body.price, user._id)
            return res.status(200).send({ status: statuses.BOUGHT, code: 200 })
        }
        return res.status(401).send({ status: statuses.INSUFFICIENT_FUNDS, code: 401 })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
})

/**
 * Changes user funds
 * @param {number} funds of user
 * @param {number} price to subtract
 * @param {string} id of user
 */
async function changeUserFunds(funds, price, id) {
    const filter = {
        _id: id
    }
    const update = {
        funds: funds - price
    }

    try {
        await User.updateOne(filter, update)
    } catch (e) { }
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
        price: Joi.number().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router