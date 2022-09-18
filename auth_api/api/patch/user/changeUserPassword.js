const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const Joi = require('joi')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')
const { User } = require('../../../models/user')
const salt = 10

// Middleware for changing user username
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400 })
    }

    let user = await User.findOne({ email: req.body.email })

    if (user) {
        if (checkIfBanned(user)) {
            return res.status(401).send({ status: 'USER IS BANNED', code: 401 })
        }

        if (req.body.password != req.body.repeatPassword) {
            return res.status(400).send({ status: "PASSWORDS DO NOT MATCH", code: 400 })
        }

        if (user.accessToken == req.body.accessToken) {
            await changeUserPassword(user._id, req.body.password)
            return res.status(200).send({ status: "PASSWORD CHANGED", code: 200 })
        }

        return res.status(401).send({ status: "USER NOT AUTHORIZED", code: 401 })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404 })
})

/**
 * Changes user password
 * @param {string} id of user to alter
 * @param {string} password password to hash and save
 */
async function changeUserPassword(id, password) {
    var pass = await bcrypt.hash(password, salt)
    const filter = {
        _id: id
    }
    const update = {
        password: pass
    }

    await User.updateOne(filter, update)
}

/**
 * Validates data sent by user to change his username
 * @param {object} req object
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        accessToken: Joi.string().required(),
        password: Joi.string().required(),
        repeatPassword: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router