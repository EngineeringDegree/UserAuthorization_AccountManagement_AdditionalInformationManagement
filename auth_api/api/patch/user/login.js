const express = require('express')
const config = require('config')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const _ = require('lodash')
const { User } = require('../../../models/user')
const { Token } = require('../../../models/token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')
const { statuses } = require('../../../utils/enums/status')

// Middleware for login user
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
    }

    if (checkIfBanned(user)) {
        return res.status(401).send({ status: statuses.USER_BANNED, code: 401 })
    }

    const pass = await bcrypt.compare(req.body.password, user.password)
    if (!pass) {
        return res.status(401).send({ status: statuses.BAD_DATA, code: 401 })
    }

    const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'), { expiresIn: '1h' })
    let newToken = new Token(_.pick({
        owner: user._id,
        type: process.env.AUTHORIZATION,
        token: token,
        issuedAt: new Date()
    }, ['owner', 'type', 'token', 'issuedAt']))
    try {
        await newToken.save()
    } catch (e) { }

    const refreshToken = jwt.sign({ _id: user._id }, config.get('PrivateKey'), { expiresIn: '60d' })
    newToken = new Token(_.pick({
        owner: user._id,
        type: process.env.REFRESH,
        token: refreshToken,
        issuedAt: new Date()
    }, ['owner', 'type', 'token', 'issuedAt']))
    try {
        await newToken.save()
    } catch (e) { }

    return res.status(200).send({ status: statuses.OK, code: 200, token, refreshToken, email: user.email, username: user.username, id: user._id, funds: user.funds })
})

/**
 * Validates data sent by user to log in
 * @param {object} req contains email and password of user which want to log in
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router