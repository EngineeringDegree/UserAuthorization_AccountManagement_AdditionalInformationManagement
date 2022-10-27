const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { checkToken, askNewToken } = require('../../../utils/auth/auth_token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')
const { User } = require('../../../models/user')

// Middleware for banning user
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }
    const user = await User.findOne({ email: req.body.email })
    if (user) {
        if (user.admin) {
            if (checkIfBanned(user)) {
                return res.status(401).send({ status: 'USER IS BANNED', code: 401, action: 'LOGOUT' })
            }

            let check = checkToken(user.token, req.body.token)
            if (!check) {
                check = await askNewToken(user.refreshToken, req.body.refreshToken, user)
                if (check) {
                    let userToBan = undefined
                    try {
                        userToBan = await User.findOne({ _id: req.body.id })
                    } catch (e) {
                        return res.status(404).send({ status: "USER NOT FOUND", code: 404, action: "GO TO USERS" })
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
                            return res.status(500).send({ status: 'USER NOT BANNED', code: 500, action: 'SOMETHING WENT WRONG POPUP' })
                        }
                        return res.status(200).send({ status: 'USER BANNED', code: 200, token: check, communicate: 'User has been banned succesfully!' })
                    }
                    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'USER NOT FOUND' })
                }
                return res.status(401).send({ status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT' })
            }

            let userToBan = undefined
            try {
                userToBan = await User.findOne({ _id: req.body.id })
            } catch (e) {
                return res.status(404).send({ status: "USER NOT FOUND", code: 404, action: "GO TO USERS" })
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
                    return res.status(500).send({ status: 'USER NOT BANNED', code: 500, action: 'SOMETHING WENT WRONG POPUP' })
                }
                return res.status(200).send({ status: 'USER BANNED', code: 200, communicate: 'User has been banned succesfully!' })
            }
            return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'USER NOT FOUND' })
        }
        return res.status(401).send({ status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT' })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
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