const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { User } = require('../../../models/user')
const { checkToken, askNewToken } = require('../../../utils/auth/auth_token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')

/*
Middleware which sends users specified in parameters. 
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
        let check = await checkToken(user.email, req.query.token, process.env.AUTHORIZATION)
        if (!check) {
            check = await askNewToken(user.email, req.query.refreshToken, user._id)
            if (check) {
                let userToFind = undefined
                try {
                    userToFind = await User.findOne({ _id: req.query.id })
                } catch (e) {
                    return res.status(404).send({ status: "USER NOT FOUND", code: 404, action: "GO TO USERS" })
                }
                if (userToFind) {
                    if (user.email == userToFind.email) {
                        return res.status(200).send({ status: 'USER FOUND', code: 200, action: 'DISPLAY USER INFO AND EDIT FORM', token: check, username: userToFind.username, id: userToFind._id, email: userToFind.email, confirmed: userToFind.confirmed, admin: userToFind.admin, isAdmin: user.admin })
                    }

                    if (user.admin) {
                        return res.status(200).send({ status: 'USER FOUND', code: 200, action: 'DISPLAY USER INFO AND BANHAMMER', token: check, username: userToFind.username, id: userToFind._id, email: userToFind.email, confirmed: userToFind.confirmed, admin: userToFind.admin, isAdmin: user.admin })
                    }

                    return res.status(200).send({ status: 'USER FOUND', code: 200, action: 'DISPLAY USER INFO', token: check, username: userToFind.username, id: userToFind._id, email: userToFind.email, confirmed: userToFind.confirmed, admin: userToFind.admin, isAdmin: user.admin })
                }
                return res.status(404).send({ status: "USER NOT FOUND", code: 404, action: "GO TO USERS" })
            }
            return res.status(401).send({ status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT' })
        }

        let userToFind = undefined
        try {
            userToFind = await User.findOne({ _id: req.query.id })
        } catch (e) {
            return res.status(404).send({ status: "USER NOT FOUND", code: 404, action: "GO TO USERS" })
        }
        if (userToFind) {
            if (user.email == userToFind.email) {
                return res.status(200).send({ status: 'USER FOUND', code: 200, action: 'DISPLAY USER INFO AND EDIT FORM', username: userToFind.username, id: userToFind._id, email: userToFind.email, confirmed: userToFind.confirmed, admin: userToFind.admin, isAdmin: user.admin })
            }

            if (user.admin) {
                return res.status(200).send({ status: 'USER FOUND', code: 200, action: 'DISPLAY USER INFO AND BANHAMMER', username: userToFind.username, id: userToFind._id, email: userToFind.email, confirmed: userToFind.confirmed, admin: userToFind.admin, isAdmin: user.admin })
            }
            return res.status(200).send({ status: 'USER FOUND', code: 200, action: 'DISPLAY USER INFO', username: userToFind.username, id: userToFind._id, email: userToFind.email, confirmed: userToFind.confirmed, admin: userToFind.admin, isAdmin: user.admin })
        }
        return res.status(404).send({ status: "USER NOT FOUND", code: 404, action: "GO TO USERS" })
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
        id: Joi.string().required(),
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router