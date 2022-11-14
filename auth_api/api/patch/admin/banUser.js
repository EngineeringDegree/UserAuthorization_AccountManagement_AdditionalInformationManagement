const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { checkToken, askNewToken } = require('../../../utils/auth/auth_token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')
const { User } = require('../../../models/user')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

// Middleware for banning user
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: actions.BAD_DATA_POPUP })
    }
    const user = await User.findOne({ email: req.body.email })
    if (user) {
        if (user.admin) {
            if (checkIfBanned(user)) {
                return res.status(401).send({ status: statuses.USER_IS_BANNED, code: 401, action: actions.LOGOUT })
            }

            let check = checkToken(user._id, req.body.token, process.env.AUTHORIZATION)
            if (!check) {
                check = await checkToken(user._id, req.body.refreshToken, user._id)
                if (check) {
                    let userToBan = undefined
                    try {
                        userToBan = await User.findOne({ _id: req.body.id })
                    } catch (e) {
                        return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.GO_TO_USERS })
                    }
                    if (userToBan) {
                        const filter = {
                            _id: userToBan._id
                        }
                        let newArr = userToBan.bans
                        const currDate = new Date().getTime()
                        const banDate = `${currDate + (req.body.value * 1000 * 60 * 60 * 24)}`
                        newArr.push({
                            to: banDate,
                            givenBy: req.body.email,
                            reason: req.body.reason
                        })

                        const update = {
                            bans: newArr
                        }

                        try {
                            await User.updateOne(filter, update)
                        } catch (e) {
                            return res.status(500).send({ status: statuses.USER_NOT_BANNED, code: 500, action: actions.SOMETHING_WENT_WRONG_POPUP })
                        }
                        return res.status(200).send({ status: statuses.USER_BANNED, code: 200, token: check, action: actions.USER_BAN_SUCCESS_POPUP })
                    }
                    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.USER_NOT_FOUND_POPUP })
                }
                return res.status(401).send({ status: statuses.USER_NOT_AUTHORIZED, code: 401, action: actions.LOGOUT })
            }

            let userToBan = undefined
            try {
                userToBan = await User.findOne({ _id: req.body.id })
            } catch (e) {
                return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.GO_TO_USERS })
            }
            if (userToBan) {
                const filter = {
                    _id: userToBan._id
                }

                let newArr = userToBan.bans
                const currDate = new Date().getTime()
                const banDate = `${currDate + (req.body.value * 1000 * 60 * 60 * 24)}`
                newArr.push({
                    to: banDate,
                    givenBy: req.body.email,
                    reason: req.body.reason
                })
                const update = {
                    bans: newArr
                }

                try {
                    await User.updateOne(filter, update)
                } catch (e) {
                    return res.status(500).send({ status: statuses.USER_NOT_BANNED, code: 500, action: actions.SOMETHING_WENT_WRONG_POPUP })
                }
                return res.status(200).send({ status: statuses.USER_BANNED, code: 200, action: actions.USER_BAN_SUCCESS_POPUP })
            }
            return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.USER_NOT_FOUND_POPUP })
        }
        return res.status(401).send({ status: statuses.USER_NOT_AUTHORIZED, code: 401, action: actions.LOGOUT })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.LOGOUT })
})

/**
 * Validates data sent by user to ban
 * @param {object} req contains email, token, refreshToken of user which want to edit and id and value of days to ban user for and reason why he needs to be banned
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        id: Joi.string().required(),
        value: Joi.number().required(),
        reason: Joi.string().min(1).required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router