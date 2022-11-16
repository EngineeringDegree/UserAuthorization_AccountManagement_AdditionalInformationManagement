const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { User } = require('../../../models/user')
const { checkToken, askNewToken } = require('../../../utils/auth/auth_token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')
const { statuses } = require('../../../utils/enums/status')

/*
Middleware which sends if origin is owner of account. 
*/
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    const user = await User.findOne({ email: req.query.email })
    if (user) {
        if (checkIfBanned(user)) {
            return res.status(401).send({ status: statuses.USER_IS_BANNED, code: 401 })
        }
        let check = await checkToken(user._id, req.query.token, process.env.AUTHORIZATION)
        if (!check) {
            check = await askNewToken(user._id, req.query.refreshToken, user._id)
            if (check) {
                let userToFind = undefined
                try {
                    userToFind = await User.findOne({ _id: req.query.id })
                } catch (e) {
                    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
                }
                if (userToFind) {
                    if (user.email == userToFind.email) {
                        return res.status(200).send({ status: statuses.USER_FOUND, code: 200, token: check })
                    }
                }
                return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
            }
            return res.status(401).send({ status: statuses.USER_NOT_AUTHORIZED, code: 401 })
        }

        let userToFind = undefined
        try {
            userToFind = await User.findOne({ _id: req.query.id })
        } catch (e) {
            return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
        }
        if (userToFind) {
            if (user.email == userToFind.email) {
                return res.status(200).send({ status: statuses.USER_FOUND, code: 200 })
            }
        }
        return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 200, code: 404 })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        id: Joi.string().required(),
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router