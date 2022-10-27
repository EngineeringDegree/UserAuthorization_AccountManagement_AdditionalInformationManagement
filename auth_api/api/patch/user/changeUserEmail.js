const express = require('express')
const router = express.Router()
const Joi = require('joi')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')
const { sendConfirmationEmail } = require('../../../utils/emails/user_emails')
const { User } = require('../../../models/user')
const { Token } = require('../../../models/token')

// Middleware for changing user username
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400 })
    }

    const user = await User.findOne({ email: req.body.email })
    if (user) {
        if (checkIfBanned(user)) {
            return res.status(401).send({ status: 'USER IS BANNED', code: 401, action: 'LOGOUT' })
        }

        const pass = await bcrypt.compare(req.body.password, user.password)
        if (pass) {
            const alreadyExists = await changeUserEmail(user._id, req.body.newEmail, user.email)
            if (alreadyExists) {
                return res.status(409).send({ status: "EMAIL ALREADY REGISTERED", code: 409 })
            }

            const accessToken = await Token.findOne({ owner: req.body.newEmail, type: process.env.ACCESS })
            if (!accessToken) {
                return res.status(401).send({ status: 'NO ACCESS TOKEN', code: 404, action: 'REFRESH' })
            }

            sendConfirmationEmail({ email: req.body.newEmail, accessToken: accessToken.token })
            return res.status(200).send({ status: "EMAIL CHANGED", code: 200, email: req.body.newEmail })
        }
        return res.status(401).send({ status: 'PASSWORD NOT MATCH', code: 401 })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: "LOGOUT" })
})

/**
 * Changes user email to email variable value
 * @param {string} id of user to alter
 * @param {string} email new email of an user 
 * @param {string} oldEmail of an user 
 */
async function changeUserEmail(id, email, oldEmail) {
    const user = await User.findOne({ email: email })
    if (user) {
        return true
    }

    const accessToken = await Token.findOne({ owner: oldEmail, type: process.env.ACCESS })
    if (!accessToken) {
        return true
    }

    const tokenFilter = {
        _id: accessToken._id
    }
    const tokenUpdate = {
        owner: email
    }

    try {
        await Token.updateOne(tokenFilter, tokenUpdate)
    } catch (e) {
        return true
    }

    const filter = {
        _id: id
    }
    const update = {
        email: email,
        confirmed: false
    }

    try {
        await User.updateOne(filter, update)
    } catch (e) {
        return true
    }

    return false
}

/**
 * Validates data sent by user to change his username
 * @param {object} req object
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        newEmail: Joi.string().email().required(),
        password: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router